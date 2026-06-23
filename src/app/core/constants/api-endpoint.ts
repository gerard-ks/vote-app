import { environment } from '@env/environment';

export const API_BASE_URL = environment.apiUrl;

const AUTH_ROUTES = {
  REFRESH: ''

} as const;

const POLLS_ROUTES = {

} as const;

const VOTING_ROUTES = {

} as const;

const ADMIN_ROUTES = {

} as const;

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: AUTH_ROUTES,
  POLLS: POLLS_ROUTES,
  VOTING: VOTING_ROUTES,
  ADMIN: ADMIN_ROUTES,
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
