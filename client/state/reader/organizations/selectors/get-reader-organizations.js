import 'calypso/state/reader/init';

/**
 * Returns all of the reader organizations for a user
 *
 *
 * @param {Object}  state  Global state tree
 * @returns {Array}          Reader Organizations
 */
export default function getReaderOrganizations( state ) {
	return state.reader.organizations.items;
}
