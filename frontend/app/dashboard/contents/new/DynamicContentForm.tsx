'use client';

import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { 
  ContentRequest, 
  UniversityFieldConfig, 
  UniversityLayoutConfig,
  FieldType,
  EditMethod,
  LayoutType
} from '@/lib/types';

interface DynamicContentFormProps {
  universityId: number;
  onSubmit: (data: any) => void;
  loading: boolean;
  errors: any;
  register: any;
  control: any;
  watch: any;
  setValue: any;
  formErrors: any;
}

export function DynamicContentForm({
  universityId,
  onSubmit,
  loading,
  errors,
  register,
  control,
  watch,
  setValue,
  formErrors,
}: DynamicContentFormProps) {
  // 大学のフィールド設定を取得
  const { data: fieldConfigs, isLoading: fieldConfigsLoading } = useQuery<UniversityFieldConfig[]>({
    queryKey: ['university-field-configs', universityId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university-field-config/university/${universityId}/visible`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch field configs:', error);
        return [];
      }
    },
    enabled: !!universityId,
  });

  // 大学のレイアウト設定を取得（コンテンツ編集画面用）
  const { data: layoutConfigs, isLoading: layoutConfigsLoading } = useQuery<UniversityLayoutConfig[]>({
    queryKey: ['university-layout-configs', universityId, 'CONTENT_EDIT'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university-layout-config/university/${universityId}/layout-type/CONTENT_EDIT`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch layout configs:', error);
        return [];
      }
    },
    enabled: !!universityId,
  });

  if (fieldConfigsLoading || layoutConfigsLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-4 text-slate-600 font-medium">設定を読み込み中...</p>
      </div>
    );
  }

  // レイアウト設定がない場合は、デフォルトのフィールドを表示
  if (!layoutConfigs || layoutConfigs.length === 0) {
    return (
      <div className="space-y-6">
        {fieldConfigs && fieldConfigs.length > 0 ? (
          fieldConfigs
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((config) => (
              <DynamicField
                key={config.id}
                config={config}
                register={register}
                control={control}
                errors={formErrors}
              />
            ))
        ) : (
          <p className="text-slate-500 text-center py-8">フィールド設定がありません</p>
        )}
      </div>
    );
  }

  // レイアウト設定に基づいてセクションごとにフィールドをグループ化
  const sections = layoutConfigs
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((layout) => {
      const fieldKeys = layout.fieldKeys ? JSON.parse(layout.fieldKeys) : [];
      const sectionFields = fieldConfigs?.filter((field) => 
        fieldKeys.includes(field.fieldKey)
      ) || [];
      
      return {
        layout,
        fields: sectionFields.sort((a, b) => a.displayOrder - b.displayOrder),
      };
    });

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        if (!section.layout.visible) return null;
        
        return (
          <div
            key={section.layout.id}
            className="space-y-4"
            style={section.layout.styleConfig ? JSON.parse(section.layout.styleConfig) : {}}
          >
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">
              {section.layout.sectionName}
            </h3>
            <div className="space-y-6">
              {section.fields.length > 0 ? (
                section.fields.map((config) => (
                  <DynamicField
                    key={config.id}
                    config={config}
                    register={register}
                    control={control}
                    errors={formErrors}
                  />
                ))
              ) : (
                <p className="text-slate-400 text-sm">このセクションにフィールドが設定されていません</p>
              )}
            </div>
          </div>
        );
      })}
      
      {/* レイアウトに含まれていないフィールドも表示 */}
      {fieldConfigs && fieldConfigs.length > 0 && (
        (() => {
          const usedFieldKeys = new Set(
            layoutConfigs.flatMap((layout) => 
              layout.fieldKeys ? JSON.parse(layout.fieldKeys) : []
            )
          );
          const unusedFields = fieldConfigs.filter(
            (field) => !usedFieldKeys.has(field.fieldKey)
          );
          
          if (unusedFields.length > 0) {
            return (
              <div className="space-y-6 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">その他のフィールド</h3>
                {unusedFields
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((config) => (
                    <DynamicField
                      key={config.id}
                      config={config}
                      register={register}
                      control={control}
                      errors={formErrors}
                    />
                  ))}
              </div>
            );
          }
          return null;
        })()
      )}
    </div>
  );
}

// 動的フィールドコンポーネント
function DynamicField({
  config,
  register,
  control,
  errors,
}: {
  config: UniversityFieldConfig;
  register: any;
  control: any;
  errors: any;
}) {
  if (!config.visible) return null;

  const fieldName = config.fieldKey;
  const validation = config.validationRules 
    ? JSON.parse(config.validationRules) 
    : {};

  const renderField = () => {
    // fieldTypeがTEXTAREAの場合は、editMethodに関係なくテキストエリアを表示
    if (config.fieldType === 'TEXTAREA') {
      return (
        <textarea
          {...register(fieldName, {
            required: config.required ? `${config.fieldName}は必須です` : false,
            ...validation,
          })}
          rows={6}
          className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
          placeholder={config.description || config.fieldName}
        />
      );
    }

    // fieldTypeがSELECTまたはMULTI_SELECTの場合は、editMethodに関係なくセレクトボックスを表示
    if (config.fieldType === 'SELECT' || config.fieldType === 'MULTI_SELECT') {
      const options = config.editOptions ? JSON.parse(config.editOptions) : {};
      const optionList = options.options || [];
      const isMultiple = config.fieldType === 'MULTI_SELECT';
      
      return (
        <select
          {...register(fieldName, {
            required: config.required ? `${config.fieldName}は必須です` : false,
            ...validation,
          })}
          multiple={isMultiple}
          className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
        >
          <option value="">選択してください</option>
          {optionList.map((opt: string, idx: number) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    // fieldTypeがNUMBERの場合は、editMethodに関係なく数値入力フィールドを表示
    if (config.fieldType === 'NUMBER') {
      return (
        <input
          {...register(fieldName, {
            required: config.required ? `${config.fieldName}は必須です` : false,
            valueAsNumber: true,
            ...validation,
          })}
          type="number"
          className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
          placeholder={config.description || config.fieldName}
        />
      );
    }

    // fieldTypeがDATEの場合は、editMethodに関係なく日付入力フィールドを表示
    if (config.fieldType === 'DATE') {
      return (
        <input
          {...register(fieldName, {
            required: config.required ? `${config.fieldName}は必須です` : false,
            ...validation,
          })}
          type="date"
          className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
        />
      );
    }

    // fieldTypeがDATETIMEの場合は、editMethodに関係なく日時入力フィールドを表示
    if (config.fieldType === 'DATETIME') {
      return (
        <input
          {...register(fieldName, {
            required: config.required ? `${config.fieldName}は必須です` : false,
            ...validation,
          })}
          type="datetime-local"
          className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
        />
      );
    }

    // fieldTypeがBOOLEANの場合は、editMethodに関係なくチェックボックスを表示
    if (config.fieldType === 'BOOLEAN') {
      return (
        <div className="flex items-center space-x-2">
          <input
            {...register(fieldName)}
            type="checkbox"
            className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label className="text-sm font-medium text-slate-700">{config.fieldName}</label>
        </div>
      );
    }

    // editMethodに基づいてフィールドをレンダリング
    switch (config.editMethod) {
      case 'WYSIWYG':
        return (
          <textarea
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            rows={10}
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
            placeholder={config.description || config.fieldName}
          />
        );
      
      case 'MARKDOWN':
        return (
          <textarea
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            rows={10}
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium font-mono text-sm"
            placeholder={config.description || config.fieldName}
          />
        );
      
      case 'SELECT_DROPDOWN':
        const options = config.editOptions ? JSON.parse(config.editOptions) : {};
        const optionList = options.options || [];
        return (
          <select
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
          >
            <option value="">選択してください</option>
            {optionList.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        );
      
      case 'CHECKBOX':
        return (
          <div className="flex items-center space-x-2">
            <input
              {...register(fieldName)}
              type="checkbox"
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label className="text-sm font-medium text-slate-700">{config.fieldName}</label>
          </div>
        );
      
      case 'DATE_PICKER':
        return (
          <input
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            type="date"
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
          />
        );
      
      case 'DATETIME_PICKER':
        return (
          <input
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            type="datetime-local"
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
          />
        );
      
      case 'INPUT':
      default:
        // fieldTypeに基づいて適切なinputタイプを決定
        // 注意: NUMBER, DATE, DATETIME, TEXTAREA, SELECT, MULTI_SELECT, BOOLEANは既に上記で処理済み
        let inputType: string = 'text';
        if (config.fieldType === 'EMAIL') {
          inputType = 'email';
        } else if (config.fieldType === 'URL') {
          inputType = 'url';
        }
        // NUMBER, DATE, DATETIMEは既に上記のif文で処理されているため、ここでは処理しない
        
        return (
          <input
            {...register(fieldName, {
              required: config.required ? `${config.fieldName}は必須です` : false,
              ...validation,
            })}
            type={inputType}
            className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
            placeholder={config.description || config.fieldName}
            defaultValue={config.defaultValue || ''}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
        <span>{config.fieldName}</span>
        {config.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {errors[fieldName] && (
        <p className="text-sm text-red-600 flex items-center font-semibold mt-2">
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[fieldName]?.message}
        </p>
      )}
      {config.description && !errors[fieldName] && (
        <p className="text-xs text-slate-500 mt-1">{config.description}</p>
      )}
    </div>
  );
}

