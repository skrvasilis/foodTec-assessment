import { useEffect, useState } from "react";
import "./App.css";
import { items, itemPrices, itemSizes } from "../../data";
import { FaAngleUp } from "react-icons/fa6";

interface SizeState {
  sizeId: number;
  sizeName: string;
  price: number;
  enabled: boolean;
}

interface MenuItemState {
  itemId: number;
  name: string;
  sizes: SizeState[];
}

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

  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [initialData] = useState<MenuItemState[]>(buildInitialData());

  console.log(menuItems);

  useEffect(() => {
    localStorage.setItem("menuItems", JSON.stringify(menuItems));
  }, [menuItems]);

  const handleToggleSize = (itemId: number, sizeId: number): void => {
    console.log("Called");
    console.log(`itemid: ${itemId} sizeID: ${sizeId}`);

    const newMenuItems = menuItems.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          sizes: item.sizes.map((size) => {
            if (size.sizeId === sizeId) {
              return { ...size, enabled: !size.enabled };
            }
            return size;
          }),
        };
      }
      return item;
    });
    console.log(newMenuItems);
    setMenuItems(newMenuItems);
  };

  const handlePriceChange = (
    itemId: number,
    sizeId: number,
    price: number
  ): void => {
    console.log("price", price);
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
    console.log(item.itemId);
    console.log("initialItem", initialItem);
    return JSON.stringify(item) !== JSON.stringify(initialItem);
  };

  const handleUndo = (): void => {
    setMenuItems(initialData);
  };

  return (
    <section className="menu">
      <h2>Pizza</h2>
      {menuItems.map((item) => (
        <section className="accordion-item" key={item.itemId}>
          <button
            className="accordion-btn"
            onClick={() => setActiveItemId(item.itemId)}
          >
            <FaAngleUp className="btn-icon"/>
            {item.name}
          </button>
          {activeItemId === item.itemId && (
            <div>
              {item.sizes.map((size) => (
                <div key={size.sizeId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={size.enabled}
                      onChange={() =>
                        handleToggleSize(item.itemId, size.sizeId)
                      }
                    />
                    {size.sizeName}
                  </label>
                  <label>$</label>
                  <input
                    type="number"
                    disabled={!size.enabled}
                    value={size.price}
                    onChange={(e) =>
                      handlePriceChange(
                        item.itemId,
                        size.sizeId,
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              ))}
              {hasChanges(item) && <button onClick={handleUndo}>undo</button>}
            </div>
          )}
        </section>
      ))}
    </section>
  );
}

export default App;
