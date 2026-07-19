#include <stdio.h>
#include <stdbool.h>
#include "transit.h"

#define MAX_STATIONS 50
#define INF 99999

// 2. Reference global structures shared across files
extern double distance_matrix[MAX_STATIONS][MAX_STATIONS];
extern int time_matrix[MAX_STATIONS][MAX_STATIONS]; 
extern Station station_list[MAX_STATIONS];
extern int total_stations;

// Function to find the station with the minimum distance value
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

// Recursive helper function to print the path from source to destination
void print_path_sequence(int parent[], int current_node, Station stations[]) {
    // Base case: If we reach the starting node (where parent is -1)
    if (parent[current_node] == -1) {
        printf("%s", stations[current_node].station_name);
        return;
    }

    // Recurse backward to find the previous station first
    print_path_sequence(parent, parent[current_node], stations);

    // Print the current station as we come out of the recursion stack
    printf(" ➔ %s", stations[current_node].station_name);
}

// Core Dijkstra's Algorithm Engine
void calculate_shortest_route(int start_node, int end_node) {
    double dist[MAX_STATIONS];  // Holds the shortest distance from start_node to i
    bool visited[MAX_STATIONS]; // visited[i] will be true if station i is processed
    int parent[MAX_STATIONS];   // Array to reconstruct the final route path

    // Initialize all distances as INFINITY and visited[] as false
    for (int i = 0; i < total_stations; i++) {
        dist[i] = INF;
        visited[i] = false;
        parent[i] = -1; // No parent initially
    }

    // Distance of source station from itself is always 0
    dist[start_node] = 0;

    // Find shortest path for all stations
    for (int count = 0; count < total_stations - 1; count++) {
        // Pick the minimum distance station from the set of unvisited stations
        int u = get_min_distance_node(dist, visited);

        // If we hit an unreachable node or find no connection, stop
        if (u == -1) break;

        visited[u] = true;

        // Update dist value of the neighboring stations of the picked station
        for (int v = 0; v < total_stations; v++) {
            // Update dist[v] only if it's not visited, there is an edge, and the total
            // weight of the path from start_node to v through u is smaller than current dist[v]
            if (!visited[v] && distance_matrix[u][v] != INF && dist[u] != INF 
                && dist[u] + distance_matrix[u][v] < dist[v]) {
                
                dist[v] = dist[u] + distance_matrix[u][v];
                parent[v] = u; // Track the path path back to source
            }
        }
    }

    // 3. Integrated Clean Output Block
    if (dist[end_node] == INF) {
        printf("\n❌ Error: No active route found between these stations (Check for Admin blocks).\n");
    } else {
        printf("\n=============================================");
        printf("\n✅ OPTIMAL ROUTE FOUND!");
        printf("\n=============================================");
        printf("\nTotal Distance : %.2f KM", dist[end_node]);
        printf("\nEstimated Time : %d Mins", time_matrix[start_node][end_node]); 
        printf("\n\nRoute Path     : ");
        
        // Call our printing function correctly inside execution bounds
        print_path_sequence(parent, end_node, station_list);
        
        printf("\n=============================================\n");
    }
}