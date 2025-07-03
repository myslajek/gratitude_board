import { Suspense } from "react";
import { EntriesContract } from "../../contracts/EntriesStorageContract";
import Entry from "../../models/Entry";
import useSWR from "swr";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import "./EntriesList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import Emoji from "react-emoji-render";

const entriesFetcher = async (): Promise<Entry[]> => {
  const entries = await EntriesContract.getAllEntries();

  const sortedEntries =
    entries?.sort((a, b) => b.timestamp - a.timestamp) || [];

  return sortedEntries;
};

function EntriesContent() {
  const {
    data: entries,
    error,
    mutate,
    isValidating,
  } = useSWR("all-entries", entriesFetcher, { suspense: true });

  // const [newEntryNotification, setNewEntryNotification] = useState<
  //   string | null
  // >(null);
  // const handleEntryAdded = useCallback(
  //   async (user: string, value: string, index: number, event: any) => {
  //     console.log("New entry added:", { user, value, index });

  //     // Show notification
  //     setNewEntryNotification(
  //       `New entry added: "${value.substring(0, 50)}${
  //         value.length > 50 ? "..." : ""
  //       }"`
  //     );

  //     setTimeout(() => setNewEntryNotification(null), 3000);

  //     try {
  //       // Get the exact timestamp from the blockchain
  //       const block = await event.getBlock();
  //       const timestamp = block.timestamp;

  //       // Add the new entry directly to the list
  //       const newEntry: Entry = {
  //         value: value,
  //         timestamp: timestamp,
  //         author: user,
  //       };

  //       // Update SWR cache
  //       mutate((currentEntries) => {
  //         return currentEntries ? [...currentEntries, newEntry] : [newEntry];
  //       }, false);
  //     } catch (error) {
  //       console.error("Error processing new entry:", error);
  //       // Fallback to full refresh
  //       mutate();
  //     }
  //   },
  //   [mutate]
  // );

  // const handleEntryRemoved = useCallback(
  //   (manager: string, index: number, value: string) => {
  //     console.log("Entry removed:", { manager, index, value });

  //     mutate();
  //   },
  //   [mutate]
  // );

  // useEffect(() => {
  //   let cleanupEntryAdded: (() => void) | null = null;
  //   let cleanupEntryRemoved: (() => void) | null = null;
  //   let isMounted = true;

  //   const setupEventListeners = async () => {
  //     try {
  //       console.log("Setting up event listeners...");

  //       cleanupEntryAdded = await EntriesContract.onEntryAdded(
  //         handleEntryAdded
  //       );
  //       cleanupEntryRemoved = await EntriesContract.onEntryRemoved(
  //         handleEntryRemoved
  //       );

  //       if (isMounted) {
  //         console.log("Event listeners set up successfully");
  //       }
  //     } catch (error) {
  //       if (isMounted) {
  //         console.error("Failed to set up event listeners:", error);
  //       }
  //     }
  //   };

  //   setupEventListeners();

  //   // Cleanup function
  //   return () => {
  //     isMounted = false;
  //     console.log("Cleaning up event listeners...");

  //     if (cleanupEntryAdded) {
  //       cleanupEntryAdded();
  //     }
  //     if (cleanupEntryRemoved) {
  //       cleanupEntryRemoved();
  //     }
  //     console.log("Event listeners cleaned up");
  //   };
  // }, [handleEntryAdded, handleEntryRemoved]);

  const handleRefresh = async () => {
    await mutate();
  };

  if (error) {
    throw error;
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="main-title">Gratitude board</h1>
      </div>

      <div className="whiteboard-container">
        <div className="whiteboard">
          <div className="whiteboard-content">
            {/* {newEntryNotification && (
              <div className="notification-banner">{newEntryNotification}</div>
            )} */}

            <div className="stats">
              <div className="stats-badge">
                Entries count: {entries?.length || 0}
              </div>

              <button
                onClick={handleRefresh}
                disabled={isValidating}
                className="refresh-button"
              >
                <FontAwesomeIcon icon={faRefresh} size="lg" />
              </button>
            </div>

            {isValidating && (
              <div className="validating-banner">Fetching entries...</div>
            )}

            <ul className="entries-list">
              {entries?.map((entry, index) => (
                <li key={index} className="entry-item">
                  <Emoji className="entry-value">{entry.value}</Emoji>
                  <div className="entry-timestamp">
                    {new Date(entry.timestamp).toLocaleString("pl-PL")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading data from contract</div>
      <div className="loading-subtext">Connecting to blockchain</div>
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="error-container">
      <h3 className="error-title">Failed to laod entries</h3>
      <div className="error-message">{error.message}</div>
      <button onClick={resetErrorBoundary} className="retry-button">
        Try again
      </button>
    </div>
  );
}

export default function EntriesList() {
  return (
    <ErrorBoundary fallbackRender={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <EntriesContent />
      </Suspense>
    </ErrorBoundary>
  );
}
