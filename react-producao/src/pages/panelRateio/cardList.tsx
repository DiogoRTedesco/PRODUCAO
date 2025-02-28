import { Card, CardData } from "./card";

interface CardListProps {
  items: CardData[];
  onSave: (checkedItems: number[]) => void;
  onOpenModal: (selectedCard:CardData) => void;
  checkedItems: number[];
  handleCheckboxChange: (producaoId: number) => void;
}

export const CardList: React.FC<CardListProps> = ({ items,onSave,onOpenModal  }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {items.map((item) => (
        <Card key={item.ProducaoID} data={item} onSave={onSave} onOpenModal={onOpenModal}/>
      ))}
    </div>
  );
};