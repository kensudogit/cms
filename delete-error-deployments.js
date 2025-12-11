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

// 削除対象のプロジェクト名
const PROJECT_NAMES = [
  'cms-ybkt', 
  'cms-qyyt', 
  'cms-qqyt',  // 画像に表示されているプロジェクト
  'cms-wezh', 
  'cms-1rol', 
  'cms-6zys', 
  'cms-k8ud',
  'cms-n2cl',  // 画像に表示されているプロジェクト
  'cms-l366',  // 画像に表示されているプロジェクト
  'cms-bbxu',  // 画像に表示されているプロジェクト
  'cms-vfjr',  // 画像に表示されているプロジェクト
  'cms-v75t',  // 画像に表示されているプロジェクト
  'cms-a31p',  // 画像に表示されているプロジェクト
  'cms-4wuf',  // 画像に表示されているプロジェクト
  'cms-auq4',  // 画像に表示されているプロジェクト
  'cms-1igl'   // 画像に表示されているプロジェクト
];

async function getDeployments(projectId) {
  const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=100`, {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`❌ Failed to fetch deployments for project ${projectId}: ${res.status} ${res.statusText}`);
    console.error(`Response: ${errorText}`);
    return [];
  }
  
  const data = await res.json();
  console.log(`📊 Found ${data.deployments?.length || 0} total deployments for project ${projectId}`);
  return data.deployments || [];
}

async function getProjectId(projectName) {
  try {
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectName}`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });
    
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        const errorText = await res.text();
        errorData = { error: { message: errorText } };
      }
      
      if (res.status === 403 && errorData.error?.invalidToken) {
        console.error(`❌ 認証エラー: Vercel APIトークンが無効または期限切れです。`);
        console.error(`   新しいトークンを取得してください: https://vercel.com/account/tokens`);
        console.error(`   環境変数で設定: set VERCEL_TOKEN=your_new_token`);
        return null;
      }
      
      if (res.status === 404) {
        console.error(`❌ プロジェクト "${projectName}" が見つかりません。`);
        return null;
      }
      
      console.error(`❌ Failed to get project ID for ${projectName}: ${res.status} ${res.statusText}`);
      console.error(`   Response:`, JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await res.json();
    console.log(`🔍 Project ${projectName} ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error(`❌ Error getting project ID for ${projectName}:`, error.message);
    return null;
  }
}

async function deleteDeployment(deploymentId) {
  try {
    const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
      },
    });
    
    if (res.ok) {
      // レスポンスボディを確認（空の場合もある）
      let result = {};
      try {
        const text = await res.text();
        if (text) {
          result = JSON.parse(text);
        }
      } catch {
        // レスポンスが空またはJSONでない場合は無視
      }
      
      console.log(`   ✅ Deleted deployment: ${deploymentId}`);
      // 削除が実際に成功したか確認
      if (result.state === 'DELETED' || res.status === 200 || res.status === 204) {
        return true;
      }
      return true; // 200/204の場合は成功とみなす
    } else {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        const errorText = await res.text();
        errorData = { error: { message: errorText } };
      }
      
      console.log(`   ❌ Failed to delete deployment: ${deploymentId}`);
      console.log(`   Status: ${res.status} ${res.statusText}`);
      console.log(`   Response:`, JSON.stringify(errorData, null, 2));
      
      // 404エラーの場合は既に削除されている可能性
      if (res.status === 404) {
        console.log(`   ℹ️  Deployment ${deploymentId} may already be deleted`);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error deleting deployment ${deploymentId}:`, error.message);
    return false;
  }
}

async function main() {
  for (const projectName of PROJECT_NAMES) {
    console.log(`\n📦 Processing project: ${projectName}`);
    const projectId = await getProjectId(projectName);
    
    if (!projectId) {
      console.log(`⚠️  Skipping ${projectName} - could not get project ID`);
      continue;
    }
    
    const deployments = await getDeployments(projectId);

    // デプロイメントの状態を確認
    const states = deployments.reduce((acc, d) => {
      acc[d.state] = (acc[d.state] || 0) + 1;
      return acc;
    }, {});
    console.log(`📈 Deployment states:`, states);

    const errorDeployments = deployments.filter(d => d.state === 'ERROR');

    if (errorDeployments.length === 0) {
      console.log('✅ No error deployments found.');
      continue;
    }

    console.log(`🗑️  Found ${errorDeployments.length} error deployments. Deleting...`);
    console.log(`   Deployment IDs:`, errorDeployments.map(d => d.uid).join(', '));

    let deletedCount = 0;
    let failedCount = 0;
    
    for (const deploy of errorDeployments) {
      const success = await deleteDeployment(deploy.uid);
      if (success) {
        deletedCount++;
      } else {
        failedCount++;
      }
      // 少し待機してAPIレート制限を避ける
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`✅ Completed processing ${projectName}`);
    console.log(`   Deleted: ${deletedCount}, Failed: ${failedCount}`);
  }
}

main().catch(err => console.error(err));
