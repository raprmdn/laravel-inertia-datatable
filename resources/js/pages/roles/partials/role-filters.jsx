import { usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { __ } from '@/lib/lang.jsx';

export const roleFilterDefaults = {
    guard: [],
};

export const RoleFilters = ({ data, setData }) => {
    const { guards } = usePage().props;

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label className="text-foreground">{__('Guard')}</Label>
                <MultiSelect
                    options={guards}
                    onValueChange={(value) => setData('guard', value)}
                    value={data.guard}
                    defaultValue={data.guard}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Guard'),
                    })}
                    modalPopover={false}
                />
            </div>
        </div>
    );
};
