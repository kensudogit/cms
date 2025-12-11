const { execSync } = require('child_process');

// 削除したいプロジェクト名をここに記載
const projectName = 'cms';

function getDeployments() {
  const result = execSync(`vercel list ${projectName} --json`).toString();
  return JSON.parse(result);
}

function deleteOldDeployments(deployments) {
  // 最新の1件を残して削除対象にする
  const toDelete = deployments.slice(1);

  toDelete.forEach((deploy) => {
    const id = deploy.uid;
    console.log(`Deleting deployment: ${id}`);
    execSync(`vercel remove ${id} --yes`);
  });
}

function main() {
  console.log('Fetching deployments...');
  const deployments = getDeployments();

  if (deployments.length <= 1) {
    console.log('No deployments to delete.');
    return;
  }

  console.log(`Found ${deployments.length} deployments. Keeping the most recent one.`);
  deleteOldDeployments(deployments);
}

main();
