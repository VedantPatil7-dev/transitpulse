#ifndef TRANSIT_H
#define TRANSIT_H

#define MAX_STATIONS 50
#define INF 99999

typedef struct {
    int station_id;
    char station_name[50];
    char line_color[20];
    int is_blocked; 
} Station;

#endif