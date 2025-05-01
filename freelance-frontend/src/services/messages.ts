export interface Message {
    message_id: number;
    project_id: number;
    sender_id: number;
    receiver_id: number;
    file_id: number | null;
    content: string;
    sent_at: string;
    sender?: { user_id: number; username: string; user_type: 'client' | 'freelancer' };
    receiver?: { user_id: number; username: string; user_type: 'client' | 'freelancer' };
}

export function subscribeToMessages(
    projectId: number,
    onMessage: (message: Message) => void,
    onError: (error: Event | string) => void
): EventSource {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const sseUrl = `${apiBaseUrl}/messages/sse/${projectId}`;

    console.log(`Connecting to SSE: ${sseUrl}`);

    const eventSource = new EventSource(sseUrl, { withCredentials: false });

    eventSource.onopen = () => {
        console.log(`SSE connection opened for project ${projectId}`);
    };

    eventSource.onmessage = (event) => {
        try {
            const message: Message = JSON.parse(event.data);
            onMessage(message);
        } catch (error) {
            console.error("Failed to parse SSE message:", error, "Data:", event.data);
            onError(`Failed to parse message: ${error}`);
        }
    };

    eventSource.onerror = (errorEvent) => {
        console.error(`SSE Error for project ${projectId}:`, errorEvent);
        if (eventSource.readyState === EventSource.CLOSED) {
            console.warn(`SSE connection closed for project ${projectId}. State: ${eventSource.readyState}`);
            onError("SSE connection closed");
        } else if (eventSource.readyState === EventSource.CONNECTING) {
            console.warn(`SSE connection attempt failed for project ${projectId}. State: ${eventSource.readyState}`);
            onError("SSE connection failed");
        } else {
            onError(errorEvent);
        }
    };

    return eventSource;
}