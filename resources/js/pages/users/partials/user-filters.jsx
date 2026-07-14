import { format } from 'date-fns';
import { usePage } from '@inertiajs/react';
import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Label } from '@/components/ui/label.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { __ } from '@/lib/lang.jsx';
import { formatSnakeCase } from '@/lib/utils.js';

export const userFilterDefaults = {
    status: [],
    roles: [],
    created_at_from: '',
    created_at_to: '',
};

export const UserFilters = ({ data, setData }) => {
    const { roles } = usePage().props;
    const roleOptions = (roles?.data ?? roles ?? []).map((role) => ({
        label: formatSnakeCase(role.name),
        value: role.name,
    }));

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label className="text-foreground">{__('Status')}</Label>
                <MultiSelect
                    options={[
                        { label: __('Verified'), value: 'verified' },
                        { label: __('Unverified'), value: 'unverified' },
                    ]}
                    onValueChange={(value) => setData('status', value)}
                    value={data.status}
                    defaultValue={data.status}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Status'),
                    })}
                    modalPopover={false}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-foreground">{__('Role')}</Label>
                <MultiSelect
                    options={roleOptions}
                    onValueChange={(value) => setData('roles', value)}
                    value={data.roles}
                    defaultValue={data.roles}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Role'),
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
