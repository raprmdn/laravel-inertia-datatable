import { format } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Label } from '@/components/ui/label.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { __ } from '@/lib/lang.jsx';

export const userFilterDefaults = {
    email_verified_at: [],
    created_at_from: '',
    created_at_to: '',
};

export const UserFilters = ({ data, setData }) => {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label className="text-foreground">
                    {__('Email Verified')}
                </Label>
                <MultiSelect
                    options={[
                        { label: __('Verified'), value: 'NOT NULL' },
                        { label: __('Unverified'), value: 'NULL' },
                    ]}
                    onValueChange={(value) =>
                        setData('email_verified_at', value)
                    }
                    value={data.email_verified_at}
                    defaultValue={data.email_verified_at}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Email Verified'),
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
