#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <sqlite3.h>
#include "transit.h" // 1. Include the SQLite library

#define MAX_STATIONS 50
#define INF 99999

typedef struct {
    int station_id;
    char station_name[50];
    char line_color[20];
    int is_blocked; 
} Station;

Station station_list[MAX_STATIONS];
double distance_matrix[MAX_STATIONS][MAX_STATIONS];
int time_matrix[MAX_STATIONS][MAX_STATIONS];
int total_stations = 0;

extern void calculate_shortest_route(int start_node, int end_node);

// 2. NEW REAL DATABASE LOADER FUNCTION
void load_database_real() {
    sqlite3 *db;
    sqlite3_stmt *stmt;
    
    // Open the database file
    if (sqlite3_open("transitpulse.db", &db) != SQLITE_OK) {
        printf("❌ Database Error: Cannot open transitpulse.db\n");
        return;
    }

    // Initialize matrices to Infinity/Default values
    for(int i = 0; i < MAX_STATIONS; i++) {
        for(int j = 0; j < MAX_STATIONS; j++) {
            distance_matrix[i][j] = (i == j) ? 0 : INF;
            time_matrix[i][j] = (i == j) ? 0 : INF;
        }
    }

    // Fetch Stations
    const char *sql_stations = "SELECT station_id, station_name, line_color, is_blocked FROM Stations;";
    if (sqlite3_prepare_v2(db, sql_stations, -1, &stmt, NULL) == SQLITE_OK) {
        int idx = 0;
        while (sqlite3_step(stmt) == SQLITE_ROW && idx < MAX_STATIONS) {
            station_list[idx].station_id = sqlite3_column_int(stmt, 0);
            snprintf(station_list[idx].station_name, 50, "%s", sqlite3_column_text(stmt, 1));
            snprintf(station_list[idx].line_color, 20, "%s", sqlite3_column_text(stmt, 2));
            station_list[idx].is_blocked = sqlite3_column_int(stmt, 3);
            idx++;
        }
        total_stations = idx;
        sqlite3_finalize(stmt);
    }

    // Fetch Routes and map them to our matrices
    const char *sql_routes = "SELECT source_id, dest_id, distance_km, travel_time_mins FROM Routes;";
    if (sqlite3_prepare_v2(db, sql_routes, -1, &stmt, NULL) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int u = sqlite3_column_int(stmt, 0) - 1; // Converting 1-based SQL ID to 0-based C Index
            int v = sqlite3_column_int(stmt, 1) - 1;
            double dist = sqlite3_column_double(stmt, 2);
            int time = sqlite3_column_int(stmt, 3);

            // Apply path rules: If either station is blocked, keep weight as INF
            if (station_list[u].is_blocked == 0 && station_list[v].is_blocked == 0) {
                distance_matrix[u][v] = dist;
                distance_matrix[v][u] = dist; // Bidirectional track
                time_matrix[u][v] = time;
                time_matrix[v][u] = time;
            }
        }
        sqlite3_finalize(stmt);
    }

    sqlite3_close(db);
    printf("📊 [TransitPulse System] Real database tables successfully mapped to memory matrices!\n");
}