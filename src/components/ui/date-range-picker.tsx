'use client';

import * as React from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import 'react-day-picker/style.css';

interface DateRangePickerProps {
  selectedDays: number | 'custom';
  customRange: DateRange | undefined;
  onSelectPreset: (days: number) => void;
  onSelectCustomRange: (range: DateRange | undefined) => void;
  disabled?: boolean;
}

const PRESETS = [
  { label: '1 day', value: 1 },
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

export function DateRangePicker({
  selectedDays,
  customRange,
  onSelectPreset,
  onSelectCustomRange,
  disabled = false,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(customRange);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    if (tempRange?.from && tempRange?.to) {
      onSelectCustomRange({
        from: startOfDay(tempRange.from),
        to: endOfDay(tempRange.to),
      });
      setIsOpen(false);
    }
  };

  const formatCustomRange = () => {
    if (customRange?.from && customRange?.to) {
      return `${format(customRange.from, 'MMM d')} - ${format(customRange.to, 'MMM d, yyyy')}`;
    }
    return 'Custom';
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Preset buttons */}
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          variant={selectedDays === preset.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectPreset(preset.value)}
          disabled={disabled}
        >
          {preset.label}
        </Button>
      ))}

      {/* Custom range button with dropdown */}
      <div className="relative" ref={containerRef}>
        <Button
          variant={selectedDays === 'custom' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          {selectedDays === 'custom' ? formatCustomRange() : 'Custom'}
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-primary/10 rounded-lg shadow-xl p-4">
            <DayPicker
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
              defaultMonth={subDays(new Date(), 30)}
              classNames={{
                root: 'text-foreground',
                months: 'flex gap-4',
                month: 'space-y-2',
                month_caption: 'flex justify-center items-center h-7',
                caption_label: 'text-sm font-medium',
                nav: 'flex items-center gap-1',
                button_previous: 'absolute left-1 p-1 hover:bg-primary/10 rounded',
                button_next: 'absolute right-1 p-1 hover:bg-primary/10 rounded',
                month_grid: 'w-full border-collapse',
                weekdays: 'flex',
                weekday: 'text-muted-foreground w-8 font-normal text-xs text-center',
                week: 'flex mt-1',
                day: 'w-8 h-8 text-center text-sm relative',
                day_button: 'w-8 h-8 p-0 font-normal hover:bg-primary/10 rounded-md transition-colors',
                selected: 'bg-primary text-primary-foreground hover:bg-primary',
                range_start: 'rounded-l-md',
                range_end: 'rounded-r-md',
                range_middle: 'bg-primary/20 rounded-none',
                today: 'border border-primary/50 rounded-md',
                outside: 'text-muted-foreground/50',
                disabled: 'text-muted-foreground/30 cursor-not-allowed',
              }}
            />
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-primary/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempRange(undefined);
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempRange?.from || !tempRange?.to}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
