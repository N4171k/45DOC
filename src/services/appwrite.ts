import { account, databases } from "@/lib/appwrite";
import type { Challenge, ChallengeCompletion, UserProfile } from "@/lib/types";
import { ID, Query } from "appwrite";

// --- Appwrite Configuration ---
const AppwriteConfig = {
    databaseId: '68ab035a00371441bdcd',
    collections: {
        users: '68ab0383002396c7f1db',
        submissions: '68ab039d000a516219f9',
        challenges: '68ab14d10035d5575aac',
    },
};

// --- Authentication and User Management ---
export async function createAccount(
    userData: Omit<UserProfile, '$id' | 'isAdmin'> & { password: string; }
) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            userData.email,
            userData.password,
            userData.name
        );

        const profileData = {
            name: userData.name,
            email: userData.email,
            isAdmin: false,
            password: userData.password, // Storing the password in the database
            phone: userData.phone,
            batch: userData.batch,
            course: userData.course,
            section: userData.section,
            githubRepo: userData.githubRepo,
            enroll: userData.enroll,
        };
        await databases.createDocument(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.users,
            newAccount.$id,
            profileData
        );

        const session = await account.createEmailPasswordSession(
            userData.email,
            userData.password
        );

        return { result: session, error: null };
    } catch (error) {
        console.error("Error creating account:", error);
        return { result: null, error };
    }
}

/**
 * Fetches a single user's profile from the database.
 * @param uid The user's document ID.
 * @returns A promise that resolves to the UserProfile.
 */
export async function getUserProfile(uid: string): Promise<UserProfile> {
    try {
        const userProfile = await databases.getDocument(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.users,
            uid
        );
        return userProfile as unknown as UserProfile;
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error;
    }
}

// --- Challenge Management ---
export async function getChallenges(): Promise<Challenge[]> {
    try {
        const response = await databases.listDocuments(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.challenges,
            [Query.orderAsc('day')]
        );
        return response.documents.map(doc => ({
            ...doc,
            questions: JSON.parse(doc.questions || '[]'),
        })) as unknown as Challenge[];
    } catch (error) {
        console.error("Failed to fetch challenges:", error);
        throw error;
    }
}

/**
 * Adds a new challenge to the database.
 * @param challengeData The challenge data.
 * @returns An object containing the new document or an error.
 */
export async function addChallenge(challengeData: Omit<Challenge, '$id'>) {
    try {
        const result = await databases.createDocument(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.challenges,
            ID.unique(),
            {
                ...challengeData,
                questions: JSON.stringify(challengeData.questions),
            }
        );
        return { result, error: null };
    } catch (error) {
        console.error("Error adding challenge:", error);
        return { result: null, error };
    }
}


// --- Challenge Submissions ---
export async function saveSubmission(
    submission: Omit<ChallengeCompletion, '$id'>
) {
    try {
        const result = await databases.createDocument(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.submissions,
            ID.unique(),
            submission
        );
        return { result, error: null };
    } catch (error) {
        console.error("Error saving submission:", error);
        return { result: null, error };
    }
}

export async function getSubmissions(): Promise<ChallengeCompletion[]> {
    try {
        const response = await databases.listDocuments(
            AppwriteConfig.databaseId,
            AppwriteConfig.collections.submissions,
            [
                Query.orderDesc('completedAt'),
                Query.limit(100)
            ]
        );
        return response.documents as unknown as ChallengeCompletion[];
    } catch (error) {
        console.error("Failed to fetch submissions:", error);
        throw error;
    }
}