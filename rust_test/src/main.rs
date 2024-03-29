use core::f32;
use std::{
    collections::HashMap,
    fs::File,
    io::{BufRead, BufReader},
};

#[derive(Clone)]
pub struct Station {
    min: f32,
    max: f32,
    average: f32,
    sum: f32,
    count: usize,
}

fn main() {
    let mut station_map: HashMap<String, Station> = HashMap::new();

    let reader = BufReader::new(File::open("../1brc/measurements.txt").expect("Cannot open file"));

    for line_result in reader.lines() {
        let line = line_result.expect("Cannot read line");
        let parts: Vec<&str> = line.split(";").collect();
        let station_name = parts[0].to_string();
        let temperature = parts[1].parse::<f32>().unwrap_or(f32::NAN);

        let station = station_map.entry(station_name).or_insert_with(|| Station {
            min: temperature,
            max: temperature,
            average: 0.0,
            count: 0,
            sum: 0.0,
        });

        station.min = station.min.min(temperature);
        station.max = station.max.max(temperature);
        station.sum += temperature;
        station.count += 1;
    }

    for (_, station) in station_map.iter_mut() {
        station.average = (station.sum / station.count as f32 * 10.0).round() / 10.0;
    }
    print_station_map(station_map);
}

fn print_station_map(station_map: HashMap<String, Station>) {
    // sort by station name
    let mut station_map: Vec<_> = station_map.into_iter().collect();
    station_map.sort_by(|a, b| a.0.cmp(&b.0));
    for (station_name, station) in station_map {
        println!(
            "{}={}/{}/{}",
            station_name, station.min, station.average, station.max
        );
    }
}
