import { Box, Card, ScrollArea } from "@mantine/core";
import { Chart } from "../chat-components/charts/Chart";
import { ImageComponent } from "../chat-components/image/ImageComponent";
import { VideoComponent } from "../chat-components/video/VideoComponent";
import { ListComponent } from "../chat-components/list/ListComponent";
import { TableComponent } from "../chat-components/table/TableComponent";
import { HTMLComponent } from "../chat-components/html/htmlComponent";
import { WcaxComponent } from "../chat-components/wcax/WcaxComponent";
import { TextComponent } from "../chat-components/text/TextComponent";
import type { Part } from "../types";

// interface OnePartProps {
//   type: MessageContentPartType;
//   data: any;
// }

export const OnePart = ({ part }: { part: Part }) => {
  const { type, data } = part;
  return (
    <Card withBorder px={20} py={20} radius={14}>
      <ScrollArea w="100%">
        <Box>
          {type === "image" && <ImageComponent data={data} />}
          {type === "video" && <VideoComponent data={data} />}
          {type === "list" && <ListComponent items={data} />}
          {type === "table" && (
            <TableComponent
              header={data?.headers || []}
              rows={data?.rows || []}
            />
          )}
          {type === "chart" && (
            <Chart chartType={data.type} chartData={data.data} />
          )}
          {type === "html" && <HTMLComponent htmlString={data} />}
          {type === "wcax" && <WcaxComponent file={data} />}
          {type === "text" && <TextComponent text={data} />}
        </Box>
      </ScrollArea>
    </Card>
  );
};
