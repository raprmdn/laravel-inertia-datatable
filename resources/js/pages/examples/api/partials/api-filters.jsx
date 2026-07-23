import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.jsx';
import { Input } from '@/components/ui/input.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { format } from 'date-fns';

const options = {
    status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    payment: ['pending', 'authorized', 'paid', 'refunded', 'failed'],
    shipping: ['shipped', 'unshipped'],
    assignment: ['assigned', 'unassigned'],
    source: ['web', 'mobile', 'partner'],
    flag: ['gift', 'expedited', 'review'],
    amount: ['low', 'medium', 'high'],
};

const titleCase = (value) =>
    value
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const optionList = (values) =>
    values.map((value) => ({ value, label: titleCase(value) }));

const valuesFor = (filters, key) =>
    filters
        .filter((filter) => filter.startsWith(`${key}:`))
        .map((filter) => filter.slice(key.length + 1));

export const apiFilterDefaults = {
    statuses: [],
    payments: [],
    shipping: [],
    assignment: [],
    sources: [],
    flags: [],
    amounts: [],
    country: '',
    placedFrom: '',
    placedTo: '',
};

export const deserializeApiFilters = (filters = []) => ({
    statuses: valuesFor(filters, 'status'),
    payments: valuesFor(filters, 'payment'),
    shipping: valuesFor(filters, 'shipping'),
    assignment: valuesFor(filters, 'assignment'),
    sources: valuesFor(filters, 'source'),
    flags: valuesFor(filters, 'flag'),
    amounts: valuesFor(filters, 'amount'),
    country: valuesFor(filters, 'country')[0] ?? '',
    placedFrom: valuesFor(filters, 'placed_at_from')[0] ?? '',
    placedTo: valuesFor(filters, 'placed_at_to')[0] ?? '',
});

export const serializeApiFilters = (draft) =>
    [
        ...draft.statuses.map((value) => `status:${value}`),
        ...draft.payments.map((value) => `payment:${value}`),
        ...draft.shipping.map((value) => `shipping:${value}`),
        ...draft.assignment.map((value) => `assignment:${value}`),
        ...draft.sources.map((value) => `source:${value}`),
        ...draft.flags.map((value) => `flag:${value}`),
        ...draft.amounts.map((value) => `amount:${value}`),
        draft.country ? `country:${draft.country}` : null,
        draft.placedFrom ? `placed_at_from:${draft.placedFrom}` : null,
        draft.placedTo ? `placed_at_to:${draft.placedTo}` : null,
    ].filter(Boolean);

export const apiFilterGroups = [
    {
        id: 'status',
        label: 'Status',
        keys: ['status'],
        labels: Object.fromEntries(
            optionList(options.status).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    {
        id: 'payment',
        label: 'Payment',
        keys: ['payment'],
        labels: Object.fromEntries(
            optionList(options.payment).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    {
        id: 'shipping',
        label: 'Shipping',
        keys: ['shipping'],
        labels: Object.fromEntries(
            optionList(options.shipping).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    {
        id: 'assignment',
        label: 'Assignment',
        keys: ['assignment'],
        labels: Object.fromEntries(
            optionList(options.assignment).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    {
        id: 'source',
        label: 'Source',
        keys: ['source'],
        labels: Object.fromEntries(
            optionList(options.source).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    {
        id: 'flags',
        label: 'Flags',
        keys: ['flag'],
        labels: Object.fromEntries(
            optionList(options.flag).map(({ value, label }) => [value, label]),
        ),
    },
    {
        id: 'amount',
        label: 'Amount',
        keys: ['amount'],
        labels: Object.fromEntries(
            optionList(options.amount).map(({ value, label }) => [
                value,
                label,
            ]),
        ),
    },
    { id: 'country', label: 'Country', keys: ['country'] },
    {
        id: 'placed_at',
        label: 'Placed At',
        keys: ['placed_at_from', 'placed_at_to'],
        type: 'date-range',
    },
];

export default function ApiFilters({ data, setData }) {
    const fields = [
        ['statuses', 'Status', options.status],
        ['payments', 'Payment status', options.payment],
        ['shipping', 'Shipping', options.shipping],
        ['assignment', 'Assignment', options.assignment],
        ['sources', 'Source', options.source],
        ['flags', 'Flags', options.flag],
        ['amounts', 'Amount band', options.amount],
    ];

    return (
        <FieldGroup className="gap-4">
            {fields.map(([key, label, values]) => (
                <Field key={key} className="gap-2">
                    <FieldLabel>{label}</FieldLabel>
                    <MultiSelect
                        options={optionList(values)}
                        value={data[key]}
                        defaultValue={data[key]}
                        onValueChange={(nextValues) => setData(key, nextValues)}
                        placeholder={`Select ${label.toLowerCase()}`}
                        modalPopover={false}
                    />
                </Field>
            ))}

            <Field className="gap-2">
                <FieldLabel htmlFor="api-country">Country code</FieldLabel>
                <Input
                    id="api-country"
                    value={data.country}
                    maxLength={2}
                    onChange={(event) =>
                        setData('country', event.target.value.toUpperCase())
                    }
                    placeholder="US"
                />
            </Field>

            <Field className="gap-2">
                <FieldLabel htmlFor="api-placed-range">
                    Placed date range
                </FieldLabel>
                <DatePickerWithRange
                    htmlFor="api-placed-range"
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
