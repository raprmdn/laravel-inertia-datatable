import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { format } from 'date-fns';

export const shippingOptions = [
    { value: 'shipped', label: 'Shipped' },
    { value: 'unshipped', label: 'Unshipped' },
];

export const assignmentOptions = [
    { value: 'assigned', label: 'Assigned' },
    { value: 'unassigned', label: 'Unassigned' },
];

export const sourceOptions = [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'partner', label: 'Partner' },
];

export const flagOptions = [
    { value: 'gift', label: 'Gift' },
    { value: 'expedited', label: 'Expedited' },
    { value: 'review', label: 'Review' },
];

export const amountOptions = [
    { value: 'low', label: 'Low - below $100' },
    { value: 'medium', label: 'Medium - $100-$499.99' },
    { value: 'high', label: 'High - $500 and above' },
];

const valuesFor = (filters, key) =>
    filters
        .filter((filter) => filter.startsWith(`${key}:`))
        .map((filter) => filter.slice(key.length + 1));

const optionLabels = (options) =>
    Object.fromEntries(options.map((option) => [option.value, option.label]));

export const customColumnFilterDefaults = {
    statuses: [],
    shipping: [],
    assignment: [],
    sources: [],
    flags: [],
    amounts: [],
    placedFrom: '',
    placedTo: '',
};

export const deserializeCustomColumnFilters = (filters = []) => ({
    statuses: valuesFor(filters, 'status'),
    shipping: valuesFor(filters, 'shipping'),
    assignment: valuesFor(filters, 'assignment'),
    sources: valuesFor(filters, 'source'),
    flags: valuesFor(filters, 'flag'),
    amounts: valuesFor(filters, 'amount'),
    placedFrom: valuesFor(filters, 'placed_at_from')[0] ?? '',
    placedTo: valuesFor(filters, 'placed_at_to')[0] ?? '',
});

export const serializeCustomColumnFilters = (draft) =>
    [
        ...draft.statuses.map((value) => `status:${value}`),
        ...draft.shipping.map((value) => `shipping:${value}`),
        ...draft.assignment.map((value) => `assignment:${value}`),
        ...draft.sources.map((value) => `source:${value}`),
        ...draft.flags.map((value) => `flag:${value}`),
        ...draft.amounts.map((value) => `amount:${value}`),
        draft.placedFrom ? `placed_at_from:${draft.placedFrom}` : null,
        draft.placedTo ? `placed_at_to:${draft.placedTo}` : null,
    ].filter(Boolean);

export const customColumnFilterGroups = (statuses) => [
    {
        id: 'status',
        label: 'Status',
        keys: ['status'],
        labels: optionLabels(statuses),
    },
    {
        id: 'shipping',
        label: 'Shipping',
        keys: ['shipping'],
        labels: optionLabels(shippingOptions),
    },
    {
        id: 'assignment',
        label: 'Assignment',
        keys: ['assignment'],
        labels: optionLabels(assignmentOptions),
    },
    {
        id: 'source',
        label: 'Source',
        keys: ['source'],
        labels: optionLabels(sourceOptions),
    },
    {
        id: 'flags',
        label: 'Flags',
        keys: ['flag'],
        labels: optionLabels(flagOptions),
    },
    {
        id: 'amount',
        label: 'Amount',
        keys: ['amount'],
        labels: optionLabels(amountOptions),
    },
    {
        id: 'placed_at',
        label: 'Placed At',
        keys: ['placed_at_from', 'placed_at_to'],
        type: 'date-range',
    },
];

export default function CustomColumnFilters({ data, setData, statuses }) {
    const fields = [
        ['statuses', 'Status', statuses],
        ['shipping', 'Shipping', shippingOptions],
        ['assignment', 'Assignment', assignmentOptions],
        ['sources', 'Source', sourceOptions],
        ['flags', 'Flags', flagOptions],
        ['amounts', 'Amount band', amountOptions],
    ];

    return (
        <FieldGroup className="gap-4">
            {fields.map(([key, label, options]) => (
                <Field key={key} className="gap-2">
                    <FieldLabel>{label}</FieldLabel>
                    <MultiSelect
                        options={options}
                        value={data[key]}
                        defaultValue={data[key]}
                        onValueChange={(values) => setData(key, values)}
                        placeholder={`Select ${label.toLowerCase()}`}
                        modalPopover={false}
                    />
                </Field>
            ))}

            <Field className="gap-2">
                <FieldLabel htmlFor="custom-placed-range">
                    Placed date range
                </FieldLabel>
                <DatePickerWithRange
                    htmlFor="custom-placed-range"
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
