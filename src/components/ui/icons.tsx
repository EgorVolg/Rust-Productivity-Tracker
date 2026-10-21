// Иконки — lucide-react, под короткими именами проекта.
export {
  ChevronDown as IconChevronDown,
  FileText as IconFile,
  TriangleAlert as IconAlert,
  CircleAlert as IconInfo,
  Upload as IconUpload,
  Plus as IconPlus,
  Minus as IconMinus,
  Funnel as IconFilter,
  FunnelX as IconFilterOff,
  Calendar as IconCalendar,
  Check as IconCheck,
  X as IconX,
  Ellipsis as IconDots,
  Pencil as IconPencil,
  Copy as IconCopy,
  Trash2 as IconTrash,
} from 'lucide-react';

export function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <rect x="1" y="1" width="28" height="28" rx="9" fill="rgb(182 156 255 / 0.16)" stroke="rgb(228 218 255 / 0.45)" />
      <rect x="8" y="15" width="3.5" height="8" rx="1.75" fill="#E4DAFF" />
      <rect x="13.25" y="10" width="3.5" height="13" rx="1.75" fill="#B69CFF" />
      <rect x="18.5" y="7" width="3.5" height="16" rx="1.75" fill="#7C5CF5" />
    </svg>
  );
}
