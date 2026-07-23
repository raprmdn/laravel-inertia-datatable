import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { format } from 'date-fns';

const valuesFor = (filters, key) =>
    filters
        .filter((filter) => filter.startsWith(`${key}:`))
        .map((filter) => filter.slice(key.length + 1));

const optionLabels = (options) =>
    Object.fromEntries(options.map((option) => [option.value, option.label]));

export const basicOrderFilterDefaults = {
    statuses: [],
    payments: [],
    placedFrom: '',
    placedTo: '',
};

export const deserializeBasicOrderFilters = (filters = []) => ({
    statuses: valuesFor(filters, 'status'),
    payments: valuesFor(filters, 'payment_status'),
    placedFrom: valuesFor(filters, 'placed_at_from')[0] ?? '',
    placedTo: valuesFor(filters, 'placed_at_to')[0] ?? '',
});

export const serializeBasicOrderFilters = (draft) =>
    [
        ...draft.statuses.map((value) => `status:${value}`),
        ...draft.payments.map((value) => `payment_status:${value}`),
        draft.placedFrom ? `placed_at_from:${draft.placedFrom}` : null,
        draft.placedTo ? `placed_at_to:${draft.placedTo}` : null,
    ].filter(Boolean);

export const basicOrderFilterGroups = (statuses, paymentStatuses) => [
    {
        id: 'status',
        label: 'Status',
        keys: ['status'],
        labels: optionLabels(statuses),
    },
    {
        id: 'payment',
        label: 'Payment',
        keys: ['payment_status'],
        labels: optionLabels(paymentStatuses),
    },
    {
        id: 'placed_at',
        label: 'Placed At',
        keys: ['placed_at_from', 'placed_at_to'],
        type: 'date-range',
    },
];

export default function BasicOrderFilters({
    data,
    setData,
    statuses,
    paymentStatuses,
}) {
    return (
        <FieldGroup className="gap-4">
            <Field className="gap-2">
                <FieldLabel>Status</FieldLabel>
                <MultiSelect
                    options={statuses}
                    value={data.statuses}
                    defaultValue={data.statuses}
                    onValueChange={(values) => setData('statuses', values)}
                    placeholder="Select status"
                    modalPopover={false}
                />
            </Field>

            <Field className="gap-2">
                <FieldLabel>Payment status</FieldLabel>
                <MultiSelect
                    options={paymentStatuses}
                    value={data.payments}
                    defaultValue={data.payments}
                    onValueChange={(values) => setData('payments', values)}
                    placeholder="Select payment status"
                    modalPopover={false}
                />
            </Field>

            <Field className="gap-2">
                <FieldLabel htmlFor="basic-placed-range">
                    Placed date range
                </FieldLabel>
                <DatePickerWithRange
                    htmlFor="basic-placed-range"
                    numberOfMonths={1}
                    value={{ from: data.placedFrom, to: data.placedTo }}
                    onChange={(value) => {
                        setData(
                            'placedFrom',
                            value?.from ? format(value.from, 'dd-MM-yyyy') : '',
                        );
                        setData(
                            'placedTo',
                            value?.to ? format(value.to, 'dd-MM-yyyy') : '',
                        );
                    }}
                />
            </Field>
        </FieldGroup>
    );
}
