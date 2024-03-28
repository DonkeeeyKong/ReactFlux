import { useContext, useEffect, useState } from "react";

import useStore from "../Store";
import ContentContext from "../components/Content/ContentContext";
import useLoadMore from "./useLoadMore.js";

const useKeyHandlers = (
  handleEntryClick,
  getEntries,
  isFilteredEntriesUpdated,
) => {
  const {
    filteredEntries,
    filterStatus,
    loadMoreUnreadVisible,
    loadMoreVisible,
  } = useContext(ContentContext);

  const activeContent = useStore((state) => state.activeContent);
  const setActiveContent = useStore((state) => state.setActiveContent);

  const { handleLoadMore } = useLoadMore();

  const [isLoading, setIsLoading] = useState(false);
  const [checkNext, setCheckNext] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (checkNext && !isLoading && isFilteredEntriesUpdated) {
      handleRightKey();
      setCheckNext(false);
    }
  }, [filteredEntries, isLoading, checkNext, isFilteredEntriesUpdated]);

  // go back to entry list
  const handleEscapeKey = (entryListRef) => {
    if (!activeContent) {
      return;
    }
    setActiveContent(null);
    if (entryListRef.current) {
      entryListRef.current.setAttribute("tabIndex", "-1");
      entryListRef.current.focus();
    }
  };

  // go to previous entry
  const handleLeftKey = () => {
    const currentIndex = filteredEntries.findIndex(
      (entry) => entry.id === activeContent?.id,
    );
    if (currentIndex > 0) {
      const prevEntry = filteredEntries[currentIndex - 1];
      handleEntryClick(prevEntry);
      const card = document.querySelector(".card-custom-selected-style");
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  // go to next entry
  const handleRightKey = () => {
    if (isLoading) {
      return;
    }

    const currentIndex = filteredEntries.findIndex(
      (entry) => entry.id === activeContent?.id,
    );
    const isLastEntry = currentIndex === filteredEntries.length - 1;

    if (
      isLastEntry &&
      ((filterStatus === "all" && loadMoreVisible) || loadMoreUnreadVisible)
    ) {
      setIsLoading(true);
      handleLoadMore(getEntries)
        .then(() => setCheckNext(true))
        .finally(() => setIsLoading(false));
      return;
    }

    if (currentIndex < filteredEntries.length - 1) {
      const nextEntry = filteredEntries[currentIndex + 1];
      handleEntryClick(nextEntry);
      setCheckNext(false);
      const card = document.querySelector(".card-custom-selected-style");
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // open link externally
  const handleBKey = () => {
    if (activeContent) {
      window.open(activeContent.url, "_blank");
    }
  };

  // fetch original article
  const handleDKey = (handleFetchContent) => {
    if (activeContent) {
      handleFetchContent();
    }
  };

  // mark as read or unread
  const handleMKey = (handleUpdateEntry) => {
    if (activeContent) {
      handleUpdateEntry();
    }
  };

  // star or unstar
  const handleSKey = (handleStarEntry) => {
    if (activeContent) {
      handleStarEntry();
    }
  };

  return {
    handleEscapeKey,
    handleLeftKey,
    handleRightKey,
    handleBKey,
    handleDKey,
    handleMKey,
    handleSKey,
  };
};

export default useKeyHandlers;
