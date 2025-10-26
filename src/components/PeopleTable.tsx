import { useSearchParams } from 'react-router-dom';
import { Person } from '../types';
import { SearchLink } from './SearchLink';
import classNames from 'classnames';

export type Props = {
  people: Person[];
  selectedPersonSlug?: string | null;
  onSelect?: (slug: string) => void;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const PeopleTable: React.FC<Props> = ({
  people,
  selectedPersonSlug = null,
  onSelect,
}) => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query')?.toLowerCase() || '';
  const sex = searchParams.get('sex');
  const centuries = searchParams.getAll('centuries');

  const visiblePeople = people.filter(person => {
    const matchesQuery = person.name.toLowerCase().includes(query);
    const matchesSex = !sex || person.sex === sex;
    const matchesCentury =
      centuries.length === 0 ||
      centuries.includes(String(Math.ceil(person.born / 100)));

    return matchesQuery && matchesSex && matchesCentury;
  });

  if (visiblePeople.length === 0) {
    return (
      <p className="has-text-centered" data-cy="noResults">
        There are no people matching the current search criteria
      </p>
    );
  }

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>
      <tbody>
        {visiblePeople.map(person => {
          const mother = people.find(p => p.name === person.motherName) || null;
          const father = people.find(p => p.name === person.fatherName) || null;

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={classNames({
                'has-background-warning': person.slug === selectedPersonSlug,
              })}
              onClick={() => onSelect?.(person.slug)}
            >
              <td>
                <SearchLink person={person} />
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                <SearchLink
                  person={mother}
                  fallbackName={person.motherName || null}
                />
              </td>
              <td>
                <SearchLink
                  person={father}
                  fallbackName={person.fatherName || null}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
