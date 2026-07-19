#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <sqlite3.h>

#define MAX_STATIONS 50
#define INF 99999

// 1. Structure Definition
typedef struct {
    int station_id;
    char station_name[50];
    char line_color[20];
    int is_blocked; 
} Station;

// 2. Global System Arrays
Station station_list[MAX_STATIONS];
double distance_matrix[MAX_STATIONS][MAX_STATIONS];
int time_matrix[MAX_STATIONS][MAX_STATIONS];
int total_stations = 0;

// 3. Dijkstra Engine Functions
int get_min_distance_node(double dist[], bool visited[]) {
    double min = INF;
    int min_index = -1;
    for (int v = 0; v < total_stations; v++) {
        if (visited[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void print_path_sequence(int parent[], int current_node, Station stations[]) {
    if (parent[current_node] == -1) {
        printf("%s", stations[current_node].station_name);
        return;
    }
    print_path_sequence(parent, parent[current_node], stations);
    printf(" ➔ %s", stations[current_node].station_name);
}

void calculate_shortest_route(int start_node, int end_node) {
    double dist[MAX_STATIONS];
    bool visited[MAX_STATIONS];
    int parent[MAX_STATIONS];

    for (int i = 0; i < total_stations; i++) {
        dist[i] = INF;
        visited[i] = false;
        parent[i] = -1;
    }

    dist[start_node] = 0;

    for (int count = 0; count < total_stations - 1; count++) {
        int u = get_min_distance_node(dist, visited);
        if (u == -1) break;
        visited[u] = true;

        for (int v = 0; v < total_stations; v++) {
            if (!visited[v] && distance_matrix[u][v] != INF && dist[u] != INF 
                && dist[u] + distance_matrix[u][v] < dist[v]) {
                dist[v] = dist[u] + distance_matrix[u][v];
                parent[v] = u;
            }
        }
    }

    if (dist[end_node] == INF) {
        printf("\n❌ Error: No active route found between these stations (Check for Admin blocks).\n");
    } else {
        printf("\n=============================================");
        printf("\n✅ OPTIMAL ROUTE FOUND!");
        printf("\n=============================================");
        printf("\nTotal Distance : %.2f KM", dist[end_node]);
        printf("\nEstimated Time : %d Mins", time_matrix[start_node][end_node]); 
        printf("\n\nRoute Path     : ");
        print_path_sequence(parent, end_node, station_list);
        printf("\n=============================================\n");
    }
}

// 4. Real Database Sync Function
void load_database_real() {
    sqlite3 *db;
    sqlite3_stmt *stmt;
    
    if (sqlite3_open("transitpulse.db", &db) != SQLITE_OK) {
        printf("❌ Database Error: Cannot open transitpulse.db\n");
        return;
    }

    for(int i = 0; i < MAX_STATIONS; i++) {
        for(int j = 0; j < MAX_STATIONS; j++) {
            distance_matrix[i][j] = (i == j) ? 0 : INF;
            time_matrix[i][j] = (i == j) ? 0 : INF;
        }
    }

    const char *sql_stations = "SELECT station_id, station_name, line_color, is_blocked FROM Stations;";
    if (sqlite3_prepare_v2(db, sql_stations, -1, &stmt, NULL) == SQLITE_OK) {
        int idx = 0;
        while (sqlite3_step(stmt) == SQLITE_ROW && idx < MAX_STATIONS) {
            station_list[idx].station_id = sqlite3_column_int(stmt, 0);
            snprintf(station_list[idx].station_name, 50, "%s", (const char*)sqlite3_column_text(stmt, 1));
            snprintf(station_list[idx].line_color, 20, "%s", (const char*)sqlite3_column_text(stmt, 2));
            station_list[idx].is_blocked = sqlite3_column_int(stmt, 3);
            idx++;
        }
        total_stations = idx;
        sqlite3_finalize(stmt);
    }

    const char *sql_routes = "SELECT source_id, dest_id, distance_km, travel_time_mins FROM Routes;";
    if (sqlite3_prepare_v2(db, sql_routes, -1, &stmt, NULL) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int u = sqlite3_column_int(stmt, 0) - 1; 
            int v = sqlite3_column_int(stmt, 1) - 1;
            double dist = sqlite3_column_double(stmt, 2);
            int time = sqlite3_column_int(stmt, 3);

            if (station_list[u].is_blocked == 0 && station_list[v].is_blocked == 0) {
                distance_matrix[u][v] = dist;
                distance_matrix[v][u] = dist;
                time_matrix[u][v] = time;
                time_matrix[v][u] = time;
            }
        }
        sqlite3_finalize(stmt);
    }

    sqlite3_close(db);
    printf("📊 [TransitPulse] Database loaded successfully into RAM matrices!\n");
}

// 5. Portals and Menus
void display_commuter_menu() {
    int start, end;
    printf("\n--- 🚇 COMMUTER ROUTE PORTAL ---\n");
    printf("Available Stations:\n");
    for(int i = 0; i < total_stations; i++) {
        printf("[%d] %s (%s Line)\n", i, station_list[i].station_name, station_list[i].line_color);
    }
    
    printf("\nEnter Starting Station ID: ");
    scanf("%d", &start);
    printf("Enter Destination Station ID: ");
    scanf("%d", &end);
    
    if(start >= 0 && start < total_stations && end >= 0 && end < total_stations) {
        calculate_shortest_route(start, end);
    } else {
        printf("\n❌ Invalid Station IDs selected.\n");
    }
}

void display_admin_menu() {
    int choice, target_id;
    printf("\n--- 🔑 ADMIN CONTROL PANEL ---\n");
    printf("[1] View Network Status\n");
    printf("[2] Toggle Station State (Block/Unblock)\n");
    printf("Select Option: ");
    scanf("%d", &choice);
    
    if (choice == 1) {
        printf("\nStation Monitoring Matrix:\n");
        for(int i = 0; i < total_stations; i++) {
            printf("ID: %d | %-12s | Status: %s\n", 
                   i, station_list[i].station_name, 
                   station_list[i].is_blocked ? "BLOCKED ❌" : "ACTIVE  ✅");
        }
    } else if (choice == 2) {
        printf("\nEnter Station ID to toggle: ");
        scanf("%d", &target_id);
        if(target_id >= 0 && target_id < total_stations) {
            station_list[target_id].is_blocked = !station_list[target_id].is_blocked;
            
            for(int i = 0; i < total_stations; i++) {
                if(station_list[target_id].is_blocked) {
                    distance_matrix[i][target_id] = INF;
                    distance_matrix[target_id][i] = INF;
                }
            }
            
            if(!station_list[target_id].is_blocked) {
                load_database_real();
            }
            
            printf("\n🔄 Status updated successfully for %s!\n", station_list[target_id].station_name);
        } else {
            printf("\n❌ Invalid Station ID.\n");
        }
    }
}

// 6. True Application Main Entry Point
int main() {
    int choice;
    load_database_real(); 
    
    while(true) {
        printf("\n=============================================");
        printf("\n          TRANSITPULSE SYSTEM MAIN           ");
        printf("\n=============================================");
        printf("\n[1] Enter Commuter Portal");
        printf("\n[2] Enter Admin Portal");
        printf("\n[3] Exit System");
        printf("\n=============================================");
        printf("\nSelect your entry channel: ");
        scanf("%d", &choice);
        
        switch(choice) {
            case 1: display_commuter_menu(); break;
            case 2: display_admin_menu(); break;
            case 3: printf("\nShutting down TransitPulse engine. Goodbye!\n"); exit(0);
            default: printf("\n❌ Invalid input selection. Try again.\n");
        }
    }
    return 0;
}