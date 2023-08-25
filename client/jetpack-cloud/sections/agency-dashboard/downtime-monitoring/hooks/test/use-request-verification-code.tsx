/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { useRequestVerificationCode } from '..';
import type { RequestVerificationCodeParams } from '../../../sites-overview/types';

describe( 'useRequestVerificationCode', () => {
	const queryClient = new QueryClient();
	const wrapper = ( { children } ) => (
		<QueryClientProvider client={ queryClient }>{ children }</QueryClientProvider>
	);

	it( 'should return initial values', async () => {
		const { result } = renderHook( () => useRequestVerificationCode(), { wrapper } );

		const params = {
			type: 'email',
			value: 'testemail@test.com',
			site_ids: [],
		} as RequestVerificationCodeParams;

		act( () => {
			result.current.mutate( params );
		} );

		await waitFor( () => expect( result.current.isLoading ).toBe( true ) );
	} );

	// Write more test cases for different scenarios
} );
