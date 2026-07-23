import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { format } from 'date-fns';

export const shippingOptions = [
    { value: 'shipped', label: 'Shipped' },
    { value: 'unshipped', label: 'Unshipped' },
];

const valuesFor = (filters, key) =>
    filters
        .filter((filter) => filter.startsWith(`${key}:`))
        .map((filter) => filter.slice(key.length + 1));

const optionLabels = (options) =>
    Object.fromEntries(options.map((option) => [option.value, option.label]));

export const migrationFilterDefaults = {
    statuses: [],
    payments: [],
    customers: [],
    shipping: [],
    placedFrom: '',
    placedTo: '',
};

export const deserializeMigrationFilters = (filters = []) => ({
    statuses: valuesFor(filters, 'status'),
    payments: valuesFor(filters, 'payment'),
    customers: valuesFor(filters, 'customer'),
    shipping: valuesFor(filters, 'shipping'),
    placedFrom: valuesFor(filters, 'placed_at_from')[0] ?? '',
    placedTo: valuesFor(filters, 'placed_at_to')[0] ?? '',
});

export const serializeMigrationFilters = (draft) =>
    [
        ...draft.statuses.map((value) => `status:${value}`),
        ...draft.payments.map((value) => `payment:${value}`),
        ...draft.customers.map((value) => `customer:${value}`),
        ...draft.shipping.map((value) => `shipping:${value}`),
        draft.placedFrom ? `placed_at_from:${draft.placedFrom}` : null,
        draft.placedTo ? `placed_at_to:${draft.placedTo}` : null,
    ].filter(Boolean);

export const migrationFilterGroups = ({
    statuses,
    paymentStatuses,
    customerOptions,
}) => [
    {
        id: 'status',
        label: 'Status',
        keys: ['status'],
        labels: optionLabels(statuses),
    },
    {
        id: 'payment',
        label: 'Payment',
        keys: ['payment'],
        labels: optionLabels(paymentStatuses),
    },
    {
        id: 'customer',
        label: 'Customer',
        keys: ['customer'],
        labels: optionLabels(customerOptions),
    },
    {
        id: 'shipping',
        label: 'Shipping',
        keys: ['shipping'],
        labels: optionLabels(shippingOptions),
    },
    {
        id: 'placed_at',
        label: 'Placed At',
        keys: ['placed_at_from', 'placed_at_to'],
        type: 'date-range',
    },
];

export default function MigrationFilters({
    data,
    setData,
    statuses,
    paymentStatuses,
    customerOptions,
}) {
    const fields = [
        ['statuses', 'Status', statuses],
        ['payments', 'Payment status', paymentStatuses],
        ['customers', 'Customer', customerOptions],
        ['shipping', 'Shipping', shippingOptions],
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
                <FieldLabel htmlFor="migration-placed-range">
                    Placed date range
                </FieldLabel>
                <DatePickerWithRange
                    htmlFor="migration-placed-range"
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
