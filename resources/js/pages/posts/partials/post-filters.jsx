import { format } from 'date-fns';
import { usePage } from '@inertiajs/react';
import { DatePickerWithRange } from '@/components/ui/date-time-picker-range.jsx';
import { Label } from '@/components/ui/label.jsx';
import { MultiSelect } from '@/components/ui/multi-select.jsx';
import { MultiSelectAPI } from '@/components/ui/multi-select-api.jsx';
import useApiOptions from '@/hooks/use-api-options.js';
import { __ } from '@/lib/lang.jsx';

export const postFilterDefaults = {
    author: [],
    category: [],
    status: [],
    created_at_from: '',
    created_at_to: '',
};

export const PostFilters = ({
    data,
    setData,
    selectedAuthors,
    onSelectedAuthorsChange,
}) => {
    const { categories = [], statuses = [] } = usePage().props;
    const categoryOptions = categories.map((category) => ({
        label: category.name,
        value: category.slug,
    }));
    const statusOptions = statuses.map((status) => ({
        label: __(status.label),
        value: status.value,
    }));
    const {
        options: authorOptions,
        search: authorSearch,
        setSearch: setAuthorSearch,
        loading: authorsLoading,
        error: authorsError,
        hasMore: authorsHaveMore,
    } = useApiOptions({
        url: route('api.users.options'),
        minimumCharacters: 2,
        debounce: 300,
    });

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label className="text-foreground">{__('Author')}</Label>
                <MultiSelectAPI
                    options={authorOptions}
                    value={data.author}
                    selectedOptions={selectedAuthors}
                    onValueChange={(values, options) => {
                        setData('author', values);
                        onSelectedAuthorsChange(options);
                    }}
                    searchValue={authorSearch}
                    onSearchValueChange={setAuthorSearch}
                    loading={authorsLoading}
                    error={
                        authorsError
                            ? __('Unable to load authors. Try another search.')
                            : null
                    }
                    hasMore={authorsHaveMore}
                    minimumSearchLength={2}
                    maxCount={2}
                    placeholder={__('Select :key', {
                        key: __('Author'),
                    })}
                    searchPlaceholder={__('Search :key', {
                        key: __('Author'),
                    })}
                    loadingText={__('Searching...')}
                    minimumSearchText={__(
                        'Type at least 2 characters to search.',
                    )}
                    noResultsText={__('No results found.')}
                    moreResultsText={__(
                        'More results available. Refine your search.',
                    )}
                    clearText={__('Clear')}
                    closeText={__('Close')}
                    unknownOptionLabel={__('Unknown author')}
                    modalPopover={false}
                />
            </div>

            <div className="grid gap-2">
                <Label className="text-foreground">{__('Category')}</Label>
                <MultiSelect
                    options={categoryOptions}
                    onValueChange={(value) => setData('category', value)}
                    value={data.category}
                    defaultValue={data.category}
                    maxCount={3}
                    placeholder={__('Select :key', {
                        key: __('Category'),
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
