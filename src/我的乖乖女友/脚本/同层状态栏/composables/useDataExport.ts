import { klona } from 'klona';
import { Schema } from '../../../schema';
import type { ZodIssue } from 'zod';

export function useDataExport() {
  // 导出数据为 JSON 文件
  function exportData(data: unknown, filename = '我的乖乖女友-存档') {
    try {
      const exportObj = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        data: klona(data),
      };

      const jsonStr = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true } as const;
    } catch (e) {
      console.error('Export failed:', e);
      return { success: false, error: String(e) } as const;
    }
  }

  // 导入数据从 JSON 文件
  function importData(onSuccess: (data: ReturnType<typeof Schema.parse>) => void, onError: (error: string) => void) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        onError('未选择文件');
        return;
      }

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        // 验证版本
        if (!json.version || !json.data) {
          onError('无效的存档文件格式');
          return;
        }

        // 使用 zod 验证数据
        const result = Schema.safeParse(json.data);
        if (!result.success) {
          // 格式化 zod 错误信息为可读文本（使用 issues）
          const errorMsg = result.error.issues
            .map((issue: ZodIssue) => {
              const path = Array.isArray(issue.path) && issue.path.length > 0 ? issue.path.join('.') : '(root)';
              return `${path}: ${issue.message}`;
            })
            .join('\n');

          onError(`数据验证失败:\n${errorMsg}`);
          return;
        }

        onSuccess(result.data);
      } catch (e) {
        if (e instanceof SyntaxError) {
          onError('JSON 解析失败: 文件格式错误');
        } else {
          onError(`导入失败: ${String(e)}`);
        }
      }
    };

    input.click();
  }

  return {
    exportData,
    importData,
  } as const;
}
