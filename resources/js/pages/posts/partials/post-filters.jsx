import { format } from 'date-fns';
import { usePage } from '@inertiajs/react';
import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Label } from '@/components/ui/label.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { __ } from '@/lib/lang.jsx';

export const postFilterDefaults = {
    author: [],
    status: [],
    created_at_from: '',
    created_at_to: '',
};

export const PostFilters = ({ data, setData }) => {
    const { authors = [], statuses = [] } = usePage().props;
    const authorOptions = authors.map((author) => ({
        label: author.name,
        value: String(author.id),
    }));
    const statusOptions = statuses.map((status) => ({
        label: __(status.label),
        value: status.value,
    }));

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label className="text-foreground">{__('Author')}</Label>
                <MultiSelect
                    options={authorOptions}
                    onValueChange={(value) => setData('author', value)}
                    value={data.author}
                    defaultValue={data.author}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Author'),
                    })}
                    modalPopover={false}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-foreground">{__('Status')}</Label>
                <MultiSelect
                    options={statusOptions}
                    onValueChange={(value) => setData('status', value)}
                    value={data.status}
                    defaultValue={data.status}
                    maxCount={3}
                    placeholder={__('Select :key', {
                        key: __('Status'),
                    })}
                    modalPopover={false}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-foreground">
                    {__('Created Date Range')}
                </Label>
                <DatePickerWithRange
                    classNameButton="h-10"
                    onChange={(value) => {
                        setData(
                            'created_at_from',
                            value?.from ? format(value.from, 'dd-MM-yyyy') : '',
                        );
                        setData(
                            'created_at_to',
                            value?.to ? format(value.to, 'dd-MM-yyyy') : '',
                        );
                    }}
                    value={{
                        from: data.created_at_from,
                        to: data.created_at_to,
                    }}
                />
            </div>
        </div>
    );
};
