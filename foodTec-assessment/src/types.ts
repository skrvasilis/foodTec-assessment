export interface SizeState {
    sizeId: number;
    sizeName: string;
    price: number;
    enabled: boolean;
    previousPrice? : number;
  }
  
  export interface MenuItemState {
    itemId: number;
    name: string;
    sizes: SizeState[];
  }


  export interface PizzaComponentProps {
    item: MenuItemState;
    activeItemId: number | null;
    handleActiveItem: (id: number) => void;
    handleToggleSize: (itemId: number, sizeId: number) => void;
    handlePriceChange: (itemId: number, sizeId: number, price: number) => void;
    hasChanges: (item: MenuItemState) => boolean;
    handleUndo: (itemId: number) => void;
  }