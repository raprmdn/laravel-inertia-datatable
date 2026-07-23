import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { MultiSelectAPI } from '@/components/ui/multi-select-api.jsx';
import useApiOptions from '@/hooks/use-api-options.js';
import { format } from 'date-fns';

const valuesFor = (filters, key) =>
    filters
        .filter((filter) => filter.startsWith(`${key}:`))
        .map((filter) => filter.slice(key.length + 1));

const optionLabels = (options) =>
    Object.fromEntries(options.map((option) => [option.value, option.label]));

export const relationshipFilterDefaults = {
    customers: [],
    companies: [],
    countries: [],
    agents: [],
    placedFrom: '',
    placedTo: '',
};

export const deserializeRelationshipFilters = (filters = []) => ({
    customers: valuesFor(filters, 'customer'),
    companies: valuesFor(filters, 'company'),
    countries: valuesFor(filters, 'country'),
    agents: valuesFor(filters, 'agent'),
    placedFrom: valuesFor(filters, 'placed_at_from')[0] ?? '',
    placedTo: valuesFor(filters, 'placed_at_to')[0] ?? '',
});

export const serializeRelationshipFilters = (draft) =>
    [
        ...draft.customers.map((value) => `customer:${value}`),
        ...draft.companies.map((value) => `company:${value}`),
        ...draft.countries.map((value) => `country:${value}`),
        ...draft.agents.map((value) => `agent:${value}`),
        draft.placedFrom ? `placed_at_from:${draft.placedFrom}` : null,
        draft.placedTo ? `placed_at_to:${draft.placedTo}` : null,
    ].filter(Boolean);

export const relationshipFilterGroups = ({
    selectedCustomerOptions,
    companyOptions,
    countryOptions,
    agentOptions,
}) => [
    {
        id: 'customer',
        label: 'Customer',
        keys: ['customer'],
        labels: optionLabels(selectedCustomerOptions),
    },
    {
        id: 'company',
        label: 'Company',
        keys: ['company'],
        labels: optionLabels(companyOptions),
    },
    {
        id: 'country',
        label: 'Country',
        keys: ['country'],
        labels: optionLabels(countryOptions),
    },
    {
        id: 'agent',
        label: 'Agent',
        keys: ['agent'],
        labels: optionLabels(agentOptions),
    },
    {
        id: 'placed_at',
        label: 'Placed At',
        keys: ['placed_at_from', 'placed_at_to'],
        type: 'date-range',
    },
];

export default function RelationshipFilters({
    data,
    setData,
    selectedCustomerOptions = [],
    companyOptions = [],
    countryOptions = [],
    agentOptions = [],
}) {
    const {
        options: customerOptions,
        search,
        setSearch,
        loading,
        error,
        hasMore,
    } = useApiOptions({
        url: route('api.customers.options'),
        minimumCharacters: 2,
        debounce: 300,
    });
    const fields = [
        ['companies', 'Company', companyOptions],
        ['countries', 'Country', countryOptions],
        ['agents', 'Agent', agentOptions],
    ];

    return (
        <FieldGroup className="gap-4">
            <Field className="gap-2">
                <FieldLabel>Customer</FieldLabel>
                <MultiSelectAPI
                    options={customerOptions.map(({ label }) => ({
                        value: label,
                        label,
                    }))}
                    value={data.customers}
                    selectedOptions={selectedCustomerOptions}
                    onValueChange={(values) => setData('customers', values)}
                    searchValue={search}
                    onSearchValueChange={setSearch}
                    loading={loading}
                    error={
                        error
                            ? 'Unable to load customers. Try another search.'
                            : null
                    }
                    hasMore={hasMore}
                    minimumSearchLength={2}
                    maxCount={2}
                    placeholder="Search customers"
                    searchPlaceholder="Search name or customer number"
                    loadingText="Searching customers..."
                    minimumSearchText="Type at least 2 characters to search."
                    noResultsText="No customers found."
                    moreResultsText="More customers available. Refine your search."
                    unknownOptionLabel="Unknown customer"
                    modalPopover={false}
                />
            </Field>

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
                <FieldLabel htmlFor="relationship-placed-range">
                    Placed date range
                </FieldLabel>
                <DatePickerWithRange
                    htmlFor="relationship-placed-range"
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
