import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSearchWith } from '../utils/searchHelper';

export const PeopleFilters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const currentSex = searchParams.get('sex');
  const selectedCenturies = searchParams.getAll('centuries');

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchParams(
      getSearchWith(searchParams, { query: event.target.value || null }),
    );
  }

  function handleSexChange(sex: 'm' | 'f' | null) {
    setSearchParams(getSearchWith(searchParams, { sex }));
  }

  function handleCenturyChange(century: string) {
    const current = searchParams.getAll('centuries');
    const updated = current.includes(century)
      ? current.filter(c => c !== century)
      : [...current, century];

    const newParams = getSearchWith(searchParams, {
      centuries: updated.length ? updated : null,
    });

    setSearchParams(newParams);
  }

  function handleReset() {
    setSearchParams({});
  }

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        <a
          className={!currentSex ? 'is-active' : ''}
          onClick={() => handleSexChange(null)}
        >
          All
        </a>
        <a
          className={currentSex === 'm' ? 'is-active' : ''}
          onClick={() => handleSexChange('m')}
        >
          Male
        </a>
        <a
          className={currentSex === 'f' ? 'is-active' : ''}
          onClick={() => handleSexChange('f')}
        >
          Female
        </a>
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={handleQueryChange}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {['16', '17', '18', '19', '20'].map(c => (
              <button
                key={c}
                data-cy="century"
                className={`button mr-1 ${
                  selectedCenturies.includes(c) ? 'is-info' : ''
                }`}
                onClick={() => handleCenturyChange(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="level-right ml-4">
            <button
              data-cy="centuryALL"
              className="button is-success is-outlined"
              onClick={() =>
                setSearchParams(
                  getSearchWith(searchParams, { centuries: null }),
                )
              }
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <button
          className="button is-link is-outlined is-fullwidth"
          onClick={handleReset}
        >
          Reset all filters
        </button>
      </div>
    </nav>
  );
};
