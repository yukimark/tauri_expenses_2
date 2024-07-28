// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![allow(unused_imports)]
use tauri_plugin_sql::{ Builder, Migration, MigrationKind };

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
  let migrations = vec![
    Migration {
      version: 1,
      description: "create_spends_table",
      sql: include_str!("migration/create_spends.sql"),
      kind: tauri_plugin_sql::MigrationKind::Up,
    }
  ];

  tauri::Builder::default()
      .plugin(tauri_plugin_shell::init())
      .plugin(tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:expenses.db", migrations)
        .build())
      .invoke_handler(tauri::generate_handler![greet])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
