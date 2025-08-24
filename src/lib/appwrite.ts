import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('68ab027a000d3be81e8f'); // Your project ID

export const account = new Account(client);
export const databases = new Databases(client);