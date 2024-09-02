// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![allow(unused_imports)]
use tauri_plugin_sql::{ Builder, Migration, MigrationKind };

fn main() {
  let migrations = vec![
    Migration {
      version: 1,
      description: "create_categories_table",
      sql: include_str!("migration/create_categories.sql"),
      kind: tauri_plugin_sql::MigrationKind::Up,
    },
    Migration {
      version: 2,
      description: "create_spends_table",
      sql: include_str!("migration/create_spends.sql"),
      kind: tauri_plugin_sql::MigrationKind::Up,
    },
    Migration {
      version: 3,
      description: "insert_seeds_to_categories",
      sql: include_str!("migration/add_category_to_categories.sql"),
      kind: tauri_plugin_sql::MigrationKind::Up,
    },
    Migration {
      version: 4,
      description: "create_profiles_table",
      sql: include_str!("migration/create_profiles.sql"),
      kind: tauri_plugin_sql::MigrationKind::Up,
    },
  ];

  tauri::Builder::default()
      .plugin(tauri_plugin_shell::init())
      .plugin(tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:expenses.db", migrations)
        .build())
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
