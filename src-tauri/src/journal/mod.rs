mod ops;
mod parse;
mod path;
mod streak;
pub mod types;
mod write;

pub use types::ParseResult;

pub use ops::{delete_cycle, edit_cycle};
pub use parse::{parse_journal, read_journal_file};
pub use path::{ensure_migrated, journal_path};
pub use streak::{compute_streak, today};
pub use write::write_to_journal;

/// Загрузить journal из файла.
pub fn load_journal(path: &std::path::Path) -> Result<ParseResult, String> {
    ensure_migrated(path)?;
    let content = read_journal_file(path)?;
    let mut result = parse_journal(&content);
    result.streak_days = compute_streak(&result.cycles, today());
    Ok(result)
}
