// Node.js 18+ では fetch がグローバルに利用可能
// node-fetch は不要

// Vercel APIトークンを環境変数から取得（推奨）
// または、直接設定（セキュアに管理してください）
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN || 'WPaL8gBdplpRHwh5kVKS7fxd';

if (!VERCEL_TOKEN) {
  console.error('❌ エラー: Vercel APIトークンが設定されていません。');
  console.error('');
  console.error('以下のいずれかの方法でトークンを設定してください:');
  console.error('');
  console.error('方法1: 環境変数で設定');
  console.error('  Windows: set VERCEL_TOKEN=your_token_here');
  console.error('  Linux/Mac: export VERCEL_TOKEN=your_token_here');
  console.error('');
  console.error('方法2: このファイルのVERCEL_TOKEN変数に直接設定（非推奨）');
  console.error('');
  console.error('Vercel APIトークンの取得方法:');
  console.error('  1. https://vercel.com/account/tokens にアクセス');
  console.error('  2. 「Create Token」をクリック');
  console.error('  3. トークン名を入力して作成');
  console.error('  4. 表示されたトークンをコピー');
  process.exit(1);
}

// 除外するプロジェクト名
const EXCLUDED_PROJECT = 'cms-6zys';

// すべてのプロジェクトを取得
async function getAllProjects() {
  try {
    const res = await fetch('https://api.vercel.com/v9/projects?limit=100', {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        const text = await res.text();
        errorData = { error: { message: text } };
      }
      console.error(`❌ Failed to fetch projects: ${res.status} ${res.statusText}`);
      console.error(`Response:`, JSON.stringify(errorData, null, 2));
      return [];
    }

    const data = await res.json();
    return data.projects || [];
  } catch (error) {
    console.error(`❌ Error fetching projects:`, error.message);
    return [];
  }
}

// プロジェクトを削除
async function deleteProject(projectId, projectName) {
  try {
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (res.ok || res.status === 404) {
      // 404の場合は既に削除されている
      if (res.status === 404) {
        console.log(`   ℹ️  Project ${projectName} (${projectId}) may already be deleted`);
      } else {
        console.log(`   ✅ Deleted project: ${projectName} (${projectId})`);
      }
      return true;
    } else {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        const text = await res.text();
        errorData = { error: { message: text } };
      }
      console.log(`   ❌ Failed to delete project: ${projectName} (${projectId})`);
      console.log(`   Status: ${res.status} ${res.statusText}`);
      console.log(`   Response:`, JSON.stringify(errorData, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error deleting project ${projectName} (${projectId}):`, error.message);
    return false;
  }
}

async function main() {
  console.log('📦 Fetching all projects...\n');
  
  const allProjects = await getAllProjects();
  
  if (allProjects.length === 0) {
    console.log('❌ No projects found or failed to fetch projects.');
    return;
  }

  // cms-で始まるプロジェクトをフィルタリング（cms-6zysを除外）
  const cmsProjects = allProjects.filter(p => 
    p.name.startsWith('cms-') && p.name !== EXCLUDED_PROJECT
  );

  if (cmsProjects.length === 0) {
    console.log(`✅ No cms- projects found (excluding ${EXCLUDED_PROJECT}).`);
    return;
  }

  console.log(`📋 Found ${cmsProjects.length} cms- projects to delete (excluding ${EXCLUDED_PROJECT}):\n`);
  cmsProjects.forEach(p => {
    console.log(`   - ${p.name} (${p.id})`);
  });

  console.log(`\n⚠️  WARNING: This will delete ${cmsProjects.length} projects!`);
  console.log(`   Excluded project: ${EXCLUDED_PROJECT}`);
  console.log(`\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n`);

  // 5秒待機
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log(`\n🗑️  Starting deletion...\n`);

  let deletedCount = 0;
  let failedCount = 0;

  for (const project of cmsProjects) {
    console.log(`Processing: ${project.name}`);
    const success = await deleteProject(project.id, project.name);
    if (success) {
      deletedCount++;
    } else {
      failedCount++;
    }
    // APIレート制限を避けるために少し待機
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ Deletion completed!`);
  console.log(`   Deleted: ${deletedCount}`);
  console.log(`   Failed: ${failedCount}`);
  console.log(`   Excluded: ${EXCLUDED_PROJECT}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

