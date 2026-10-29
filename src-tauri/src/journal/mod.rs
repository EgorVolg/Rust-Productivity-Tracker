mod ops;
mod parse;
mod path;
mod streak;
pub mod types;
mod write;
use crate::filters::{Filters, filter_cycles};
pub use ops::{delete_cycle, edit_cycle};
pub use parse::{parse_journal, read_journal_file};
pub use path::{ensure_migrated, journal_path};
pub use streak::{compute_streak, today};
pub use types::Cycle;
pub use types::ParseResult;
pub use write::write_to_journal;

/// Загрузить journal из файла.
pub fn load_journal(path: &std::path::Path) -> Result<ParseResult, String> {
    ensure_migrated(path)?;
    let content = read_journal_file(path)?;
    let mut result = parse_journal(&content);
    result.streak_days = compute_streak(&result.cycles, today());
    result.total_cycles = result.cycles.len();
    Ok(result)
}

pub fn load_filtered_journal(
    path: &std::path::Path,
    filters: &Filters,
) -> Result<ParseResult, String> {
    let mut result = load_journal(path)?;

    // Сохраняем общее количество до фильтрации
    let total_cycles = result.cycles.len();

    // Применяем фильтрацию к циклам
    result.cycles = filter_cycles(result.cycles, filters);

    // Устанавливаем общее количество
    result.total_cycles = total_cycles;

    Ok(result)
}
