import { IMailItem } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { RefreshControl } from "react-native";
import MailListItem from "./MailListItem";

export default function MailList({ data }: { data: IMailItem[] }) {
    const [refreshing, setRefreshing] = React.useState(false);

    // Optimize render function
    const renderItem = useCallback(({ item, index }: { item: IMailItem, index: number }) => (
        <MailListItem item={item} index={index} />
    ), []);

    // Key extractor for better performance
    const keyExtractor = useCallback((item: IMailItem) => item.id, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
    );
}