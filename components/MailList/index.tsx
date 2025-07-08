import { IMailItem } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import MailListItem from "./MailListItem";

export default function MailList({ data }: { data: IMailItem[] }) {
    // Optimize render function
    const renderItem = useCallback(({ item, index }: { item: IMailItem, index: number }) => (
        <MailListItem item={item} index={index} />
    ), []);

    // Key extractor for better performance
    const keyExtractor = useCallback((item: IMailItem) => item.id, []);

    return (
        <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
        />
    );
}