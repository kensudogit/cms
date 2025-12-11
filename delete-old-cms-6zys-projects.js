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

// 対象プロジェクト名
const TARGET_PROJECT_NAME = 'cms-6zys';

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

  // cms-6zysという名前のプロジェクトをフィルタリング
  const cms6zysProjects = allProjects.filter(p => p.name === TARGET_PROJECT_NAME);

  if (cms6zysProjects.length === 0) {
    console.log(`✅ No projects found with name "${TARGET_PROJECT_NAME}".`);
    return;
  }

  if (cms6zysProjects.length === 1) {
    console.log(`ℹ️  Only one project found with name "${TARGET_PROJECT_NAME}". Nothing to delete.`);
    console.log(`   Project: ${cms6zysProjects[0].name} (${cms6zysProjects[0].id})`);
    return;
  }

  // updatedAtでソート（最新のものが最後に来るように）
  // updatedAtがない場合はcreatedAtを使用
  cms6zysProjects.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0);
    const dateB = new Date(b.updatedAt || b.createdAt || 0);
    return dateA - dateB; // 古い順にソート
  });

  // 最新のプロジェクト（最後の要素）を保持
  const latestProject = cms6zysProjects[cms6zysProjects.length - 1];
  // 削除対象は最新以外のすべて
  const projectsToDelete = cms6zysProjects.slice(0, -1);

  console.log(`📋 Found ${cms6zysProjects.length} projects with name "${TARGET_PROJECT_NAME}":\n`);
  
  console.log('🗑️  Projects to DELETE (old ones):');
  projectsToDelete.forEach((p, index) => {
    const date = new Date(p.updatedAt || p.createdAt || 0);
    console.log(`   ${index + 1}. ${p.name} (${p.id}) - Updated: ${date.toISOString()}`);
  });

  console.log(`\n✅ Project to KEEP (latest):`);
  const latestDate = new Date(latestProject.updatedAt || latestProject.createdAt || 0);
  console.log(`   ${latestProject.name} (${latestProject.id}) - Updated: ${latestDate.toISOString()}`);

  console.log(`\n⚠️  WARNING: This will delete ${projectsToDelete.length} old project(s)!`);
  console.log(`   Latest project "${latestProject.name}" will be kept.`);
  console.log(`\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n`);

  // 5秒待機
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log(`\n🗑️  Starting deletion...\n`);

  let deletedCount = 0;
  let failedCount = 0;

  for (const project of projectsToDelete) {
    console.log(`Processing: ${project.name} (${project.id})`);
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
  console.log(`   Kept (latest): ${latestProject.name} (${latestProject.id})`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

