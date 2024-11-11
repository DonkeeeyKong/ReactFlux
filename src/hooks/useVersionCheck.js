import { useEffect, useState } from "react";

import { GITHUB_REPO_PATH } from "@/utils/constants";
import buildInfo from "@/version-info.json";
import { ofetch } from "ofetch";

function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const data = await ofetch(
          `https://api.github.com/repos/${GITHUB_REPO_PATH}/commits/main`,
        );

        const currentGitDate = new Date(buildInfo.gitDate);
        const latestGitDate = new Date(data.commit.committer.date);

        setHasUpdate(currentGitDate < latestGitDate);
      } catch (error) {
        console.error("Check update failed", error);
      }
    };

    checkUpdate();
  }, []);

  return { hasUpdate };
}

export default useVersionCheck;