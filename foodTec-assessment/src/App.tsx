import { useEffect, useState } from "react";
import "./App.css";
import { items, itemPrices, itemSizes } from "../public/data";
import PizzaComponent from "./components/PizzaComponent";
import type { MenuItemState } from "./types";

function buildInitialData(): MenuItemState[] {
  return items.map((item) => {
    const prices = itemPrices.filter((p) => p.itemId === item.itemId);
    return {
      itemId: item.itemId,
      name: item.name,
      sizes: itemSizes.map((size) => {
        const priceEntry = prices.find((p) => p.sizeId === size.sizeId);
        return {
          sizeId: size.sizeId,
          sizeName: size.name,
          price: priceEntry?.price ?? 0,
          enabled: true,
          previousPrice: 0,
        };
      }),
    };
  });
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItemState[]>(() => {
    const saved = localStorage.getItem("menuItems");
    return saved ? JSON.parse(saved) : buildInitialData();
  });

  const [activeItemId, setActiveItemId] = useState<number | null>(() => {
    const stored = localStorage.getItem("activeItemId");
    return stored !== null ? parseInt(stored, 10) : null;
  });
  const [initialData] = useState<MenuItemState[]>(buildInitialData());

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    if (activeItemId !== null) {
      localStorage.setItem("activeItemId", activeItemId.toString());
    } else {
      localStorage.removeItem("activeItemId");
    }
  }, [activeItemId]);

  const handleActiveItem = (itemId: number): void => {
    if (itemId === activeItemId) {
      setActiveItemId(null);
    } else {
      setActiveItemId(itemId);
    }
  };

  const handleToggleSize = (itemId: number, sizeId: number): void => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          return {
            ...item,
            sizes: item.sizes.map((size) => {
              if (size.sizeId === sizeId && size.enabled === true) {
                return {
                  ...size,
                  enabled: false,
                  price: 0,
                  previousPrice: size.price,
                };
              } else if (size.sizeId === sizeId && size.enabled === false) {
                return {
                  ...size,
                  enabled: true,
                  price: size.previousPrice || 0,
                  previousPrice: 0,
                };
              } else {
                return size;
              }
            }),
          };
        }
        return item;
      })
    );
  };

  const handlePriceChange = (
    itemId: number,
    sizeId: number,
    price: number
  ): void => {
    console.log(price);
    const newMenuItems = menuItems.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          sizes: item.sizes.map((size) => {
            if (size.sizeId === sizeId) {
              return { ...size, price: price };
            }
            return size;
          }),
        };
      }
      return item;
    });
    setMenuItems(newMenuItems);
  };

  const hasChanges = (item: MenuItemState): boolean => {
    const initialItem = initialData.find(
      (menuItem) => menuItem.itemId == item.itemId
    );
    return JSON.stringify(item) !== JSON.stringify(initialItem);
  };

  const handleUndo = (itemId: number): void => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          return (
            initialData.find((initial) => initial.itemId === itemId) || item
          );
        }
        return item;
      })
    );
  };

  return (
    <section className="menu">
      <h2>Pizza</h2>
      {menuItems.map((item) => (
        <PizzaComponent
          key={item.itemId}
          item={item}
          activeItemId={activeItemId}
          handleActiveItem={handleActiveItem}
          handleToggleSize={handleToggleSize}
          handlePriceChange={handlePriceChange}
          hasChanges={hasChanges}
          handleUndo={handleUndo}
        />
      ))}
    </section>
  );
}

export default App;
