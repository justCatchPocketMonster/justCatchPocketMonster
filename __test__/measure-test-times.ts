import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

const execAsync = promisify(exec);

interface TestResult {
  file: string;
  time: number;
  status: 'success' | 'timeout' | 'error';
  error?: string;
}

const TEST_TIMEOUT = 600000;
const RESULTS_FILE = join(process.cwd(), 'test-performance-results.md');

function getAllTestFiles(dir: string = '__test__', fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTestFiles(filePath, fileList);
    } else if (file.endsWith('.test.ts')) {
      fileList.push(relative(process.cwd(), filePath).replace(/\\/g, '/'));
    }
  });
  
  return fileList.sort();
}

async function runTest(file: string): Promise<TestResult> {
  const startTime = Date.now();
  const testPath = file.replace(/\\/g, '/');
  
  console.log(`\n🧪 Running: ${testPath}`);
  
  try {
    const command = `npx jest "${testPath}" --runInBand --testTimeout=${TEST_TIMEOUT} --no-coverage`;
    const { stdout, stderr } = await execAsync(command, {
      timeout: TEST_TIMEOUT + 10000,
      maxBuffer: 10 * 1024 * 1024,
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const output = stdout + stderr;
    const hasFailures = 
      output.includes('FAIL') || 
      output.includes('Test Suites:') && output.includes('failed') ||
      output.includes('Tests:') && output.includes('failed');
    
    const status: 'success' | 'error' = hasFailures ? 'error' : 'success';
    
    console.log(`   ${status === 'success' ? '✅' : '❌'} Completed in ${formatTime(duration)}`);
    
    return {
      file: testPath,
      time: duration,
      status,
      error: hasFailures ? 'Test failed - see Jest output for details' : undefined,
    };
  } catch (error: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const isTimeout = 
      error.code === 'TIMEOUT' || 
      duration >= TEST_TIMEOUT ||
      error.message?.includes('timeout') ||
      error.message?.includes('TIMEOUT');
    
    const errorMessage = error.stderr || error.stdout || error.message || 'Unknown error';
    const truncatedError = errorMessage.length > 200 
      ? errorMessage.substring(0, 200) + '...' 
      : errorMessage;
    
    console.log(`   ${isTimeout ? '⏱️' : '❌'} ${isTimeout ? 'Timeout' : 'Error'} after ${formatTime(duration)}`);
    
    return {
      file: testPath,
      time: duration,
      status: isTimeout ? 'timeout' : 'error',
      error: truncatedError,
    };
  }
}

function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  if (ms < 60000) {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

function generateMarkdown(results: TestResult[]): string {
  if (results.length === 0) {
    return `# Test Performance Results\n\nNo results available yet.\n`;
  }
  
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const timeoutCount = results.filter(r => r.status === 'timeout').length;
  
  const integration = results.filter(r => r.file.includes('integration'));
  const unit = results.filter(r => r.file.includes('unit'));
  
  let markdown = `# Test Performance Results\n\n`;
  markdown += `**Date:** ${new Date().toLocaleString('en-US')}\n\n`;
  markdown += `## Global Summary\n\n`;
  markdown += `- **Total test files:** ${results.length}\n`;
  markdown += `- **Tests passed:** ${successCount} ✅\n`;
  markdown += `- **Tests failed:** ${errorCount} ❌\n`;
  markdown += `- **Tests timeout:** ${timeoutCount} ⏱️\n`;
  markdown += `- **Total execution time:** ${formatTime(totalTime)}\n`;
  markdown += `- **Average time per test:** ${formatTime(totalTime / results.length)}\n\n`;
  
  markdown += `## Integration Tests\n\n`;
  markdown += `| File | Time | Status |\n`;
  markdown += `|------|------|--------|\n`;
  
  const integrationTime = integration.reduce((sum, r) => sum + r.time, 0);
  integration.forEach(result => {
    const statusIcon = result.status === 'success' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌';
    markdown += `| \`${result.file}\` | ${formatTime(result.time)} | ${statusIcon} ${result.status} |\n`;
  });
  markdown += `| **Total** | **${formatTime(integrationTime)}** | **${integration.length} files** |\n\n`;
  
  markdown += `## Unit Tests\n\n`;
  markdown += `| File | Time | Status |\n`;
  markdown += `|------|------|--------|\n`;
  
  const unitTime = unit.reduce((sum, r) => sum + r.time, 0);
  unit.forEach(result => {
    const statusIcon = result.status === 'success' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌';
    markdown += `| \`${result.file}\` | ${formatTime(result.time)} | ${statusIcon} ${result.status} |\n`;
  });
  markdown += `| **Total** | **${formatTime(unitTime)}** | **${unit.length} files** |\n\n`;
  
  const sortedByTime = [...results].sort((a, b) => b.time - a.time);
  markdown += `## Top 10 Slowest Tests\n\n`;
  markdown += `| Rank | File | Time | Status |\n`;
  markdown += `|------|------|------|--------|\n`;
  sortedByTime.slice(0, 10).forEach((result, index) => {
    const statusIcon = result.status === 'success' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌';
    markdown += `| ${index + 1} | \`${result.file}\` | ${formatTime(result.time)} | ${statusIcon} ${result.status} |\n`;
  });
  
  markdown += `\n## Error Details\n\n`;
  const errors = results.filter(r => r.status !== 'success');
  if (errors.length === 0) {
    markdown += `No errors detected! 🎉\n`;
  } else {
    errors.forEach(result => {
      markdown += `### \`${result.file}\`\n\n`;
      markdown += `- **Status:** ${result.status}\n`;
      markdown += `- **Time:** ${formatTime(result.time)}\n`;
      if (result.error) {
        markdown += `- **Error:** ${result.error}\n`;
      }
      markdown += `\n`;
    });
  }
  
  markdown += `\n---\n\n`;
  markdown += `*Script made with AI - I was too lazy to do it myself*\n`;
  
  return markdown;
}

function loadExistingResults(): Map<string, TestResult> {
  const existingResults = new Map<string, TestResult>();
  
  if (!existsSync(RESULTS_FILE)) {
    return existingResults;
  }
  
  try {
    const content = readFileSync(RESULTS_FILE, 'utf-8');
    const filePattern = /`(__test__\/[^`]+\.test\.ts)`/g;
    let match;
    
    while ((match = filePattern.exec(content)) !== null) {
      const file = match[1];
      const fileSection = content.substring(Math.max(0, content.indexOf(match[0]) - 500), content.indexOf(match[0]) + 1000);
      const timeMatch = fileSection.match(/\| `[^`]+` \| ([^|]+) \|/);
      const statusMatch = fileSection.match(/\| `[^`]+` \| [^|]+ \| ([^|]+) \|/);
      
      if (timeMatch && statusMatch) {
        const timeStr = timeMatch[1].trim();
        const statusStr = statusMatch[1].trim();
        
        let timeMs = 0;
        if (timeStr.includes('m')) {
          const [minutes, seconds] = timeStr.split('m');
          timeMs = (parseInt(minutes) * 60 + parseFloat(seconds.replace('s', ''))) * 1000;
        } else if (timeStr.includes('s')) {
          timeMs = parseFloat(timeStr.replace('s', '')) * 1000;
        } else if (timeStr.includes('ms')) {
          timeMs = parseFloat(timeStr.replace('ms', ''));
        }
        
        let status: 'success' | 'timeout' | 'error' = 'success';
        if (statusStr.includes('timeout') || statusStr.includes('⏱️')) {
          status = 'timeout';
        } else if (statusStr.includes('error') || statusStr.includes('❌')) {
          status = 'error';
        }
        
        existingResults.set(file, {
          file,
          time: timeMs,
          status,
        });
      }
    }
  } catch (error) {
    console.log('⚠️  Unable to load existing results, starting from the beginning');
  }
  
  return existingResults;
}

async function main() {
  console.log('🔍 Searching for test files...');
  const testFiles = getAllTestFiles();
  console.log(`📋 ${testFiles.length} test files found\n`);
  
  if (existsSync(RESULTS_FILE)) {
    console.log('📝 Existing results file will be overwritten\n');
  }
  
  const results: TestResult[] = [];
  
  for (let i = 0; i < testFiles.length; i++) {
    const file = testFiles[i];
    console.log(`\n[${i + 1}/${testFiles.length}]`);
    const result = await runTest(file);
    results.push(result);
  }
  
  const markdown = generateMarkdown(results);
  writeFileSync(RESULTS_FILE, markdown, 'utf-8');
  
  console.log('\n\n✨ Analysis completed!');
  console.log(`📊 Results saved to: ${RESULTS_FILE}`);
  
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  const successCount = results.filter(r => r.status === 'success').length;
  console.log(`\n📈 Summary:`);
  console.log(`   - Total time: ${formatTime(totalTime)}`);
  console.log(`   - Tests passed: ${successCount}/${results.length}`);
  console.log(`   - Tests failed: ${results.length - successCount}`);
}

main().catch(console.error);
