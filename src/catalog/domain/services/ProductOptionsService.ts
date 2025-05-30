import type { ProductOption, SelectedOptions, ProductOptionValue } from '../ProductOption'

export class ProductOptionsService {
  // Map for quick access to options by type
  private optionsByType: Map<string, ProductOption> = new Map();

  constructor(
    private readonly options: ProductOption[],
    private selectedOptions: SelectedOptions = {}
  ) {
    // Index options by type for quick access
    if (Array.isArray(options)) {
      options.forEach(option => {
        if (option && option.type) {
          this.optionsByType.set(option.type, option);
        }
      });
    }
  }

  // Updates the selected options
  updateSelectedOptions(selectedOptions: SelectedOptions): void {
    this.selectedOptions = { ...selectedOptions };
  }

  // Gets available values for an option type
  getAvailableValues(optionType: string): ProductOptionValue[] {
    if (!optionType) {
      return [];
    }
    
    // Get option by type
    const option = this.optionsByType.get(optionType);
    if (!option) {
      return [];
    }
    
    // Verify that the option has values
    if (!option.values || !Array.isArray(option.values) || option.values.length === 0) {
      return [];
    }
    
    // Filter available values according to restrictions
    const availableValues = option.values.filter(value => {
      // Validate that the value has an ID
      if (!value || typeof value.id !== 'string') {
        return false;
      }
      
      // If it's the currently selected option, always show it
      if (this.selectedOptions[optionType] === value.id) {
        return true;
      }
      
      // Check if it's available according to restrictions
      return this.isOptionAvailable(optionType, value.id);
    });
    
    return availableValues;
  }

  // Checks if an option is available
  isOptionAvailable(optionType: string, valueId: string): boolean {
    if (!optionType || !valueId) {
      return false;
    }
    
    // Get option by type
    const option = this.optionsByType.get(optionType);
    if (!option || !Array.isArray(option.values)) {
      return false;
    }
    
    // Find the specific value
    const value = option.values.find(v => v && v.id === valueId);
    if (!value) {
      return false;
    }
    
    // If there are no restrictions, the option is available
    if (!value.restrictions || !Array.isArray(value.restrictions) || value.restrictions.length === 0) {
      return true;
    }
    
    // Check for conflicts with selected options
    for (const [type, selectedId] of Object.entries(this.selectedOptions)) {
      // Ignore the option we're evaluating
      if (type === optionType) {
        continue;
      }
      
      // If the selected option is in the restrictions, it's not available
      if (selectedId && value.restrictions.includes(selectedId)) {
        return false;
      }
    }
    
    return true;
  }

  // Updates options when a selection changes
  updateOptions(optionType: string, valueId: string | null): SelectedOptions {
    const newOptions = { ...this.selectedOptions };
    
    // Update or remove the option based on the value
    if (valueId === null) {
      delete newOptions[optionType];
    } else {
      newOptions[optionType] = valueId;
    }
    
    // Clear options that may have become invalid due to restrictions
    Object.keys(newOptions).forEach(type => {
      // Don't check the option we just changed
      if (type === optionType) return;
      
      const currentValue = newOptions[type];
      if (currentValue && !this.isOptionAvailable(type, currentValue)) {
        delete newOptions[type];
      }
    });
    
    // Update internal state
    this.selectedOptions = newOptions;
    
    return newOptions;
  }

  // Gets all options
  getAllOptions(): ProductOption[] {
    return this.options;
  }

  // Gets selected options
  getSelectedOptions(): SelectedOptions {
    return this.selectedOptions;
  }
}
