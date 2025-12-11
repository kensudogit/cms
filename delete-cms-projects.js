const { execSync } = require('child_process');
const readline = require('readline');

// ユーザーに確認を取るプロンプト関数
function askYesNo(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question + ' (yes/no): ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// Vercel CLI でプロジェクト一覧を取得
function getProjects() {
  const result = execSync('vercel projects ls --json').toString();
  return JSON.parse(result).projects;
}

// "cms-" で始まるプロジェクトを削除
async function deleteCmsProjects(projects) {
  const cmsProjects = projects.filter(p => p.name.startsWith('cms-'));

  if (cmsProjects.length === 0) {
    console.log('削除対象の cms- プロジェクトはありません。');
    return;
  }

  console.log('以下の cms- プロジェクトが削除対象です:');
  cmsProjects.forEach(p => console.log(`- ${p.name}`));

  const confirmed = await askYesNo('\n本当にこれらのプロジェクトを削除しますか？');
  if (!confirmed) {
    console.log('削除をキャンセルしました。');
    return;
  }

  cmsProjects.forEach(p => {
    console.log(`削除中: ${p.name}`);
    execSync(`vercel rm ${p.name} --yes`);
  });

  console.log('すべての cms- プロジェクトを削除しました。');
}

async function main() {
  console.log('プロジェクト一覧を取得中...');
  const projects = getProjects();
  await deleteCmsProjects(projec