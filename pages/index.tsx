import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/core";
import { BumpInputSerie, ResponsiveBump } from "@nivo/bump";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { GetStaticProps } from "next";
import React, { useState } from "react";
import creds from "../creds.json";

interface RSData {
  artist: string;
  title: string;
  releaseDate: string;
  rs2003: string;
  rs2012: string;
  rs2020: string;
  poster: string;
  genre: string;
  overview: string;
  country: string;
  label: string;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const doc = new GoogleSpreadsheet(
      "1rGkhRNC0iTJGStYLGhoSzmz8feMBhCx7mfH9ELX6OkA"
    );
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const currentSheet = doc.sheetsByIndex[0];
    const allRows = await currentSheet.getRows();
    const filteredRows = allRows.reduce<RSData[]>((a: RSData[], c: any) => {
      const {
        artist = "",
        name = "",
        rs2003 = -1,
        rs2012 = -1,
        rs2020 = -1,
        poster = "",
        genre = "",
        overview = "",
        country = "",
        label = "",
        release_date = "",
      } = c;

      a.push({
        artist,
        title: name,
        rs2003: rs2003 === "" ? -1 : rs2003,
        rs2012: rs2012 === "" ? -1 : rs2012,
        rs2020: rs2020 === "" ? -1 : rs2020,
        poster,
        releaseDate: release_date,
        genre,
        overview,
        country,
        label,
      });
      return a;
    }, []);
    return { props: { sheetsData: filteredRows } };
  } catch (err) {
    return { props: { errors: err.message } };
  }
};

function App({ sheetsData }: { sheetsData: RSData[] }) {
  const [range, setRange] = useState(25);
  const [rangeNumber, setRangeNumber] = useState(25);

  // const maximum = 50;
  const allData = sheetsData.slice(0, range);
  const bumData = allData.reduce<
    { id: string; data: { x: number; y: number | null }[] }[]
  >((a, c) => {
    a.push({
      id: c.title,
      data: [
        // {
        //   x: 2003,
        //   y:
        //     parseInt(c.rs2003) > range || parseInt(c.rs2003) === -1
        //       ? null
        //       : parseInt(c.rs2003),
        // },
        {
          x: 2012,
          y:
            parseInt(c.rs2012) > range || parseInt(c.rs2012) === -1
              ? null
              : parseInt(c.rs2012),
        },
        {
          x: 2020,
          y:
            parseInt(c.rs2020) > range || parseInt(c.rs2020) === -1
              ? null
              : parseInt(c.rs2020),
        },
      ],
    });
    return a;
  }, []);

  // console.log(bumData);
  return (
    <Box h="100vh" w="100vw">
      <Box bgColor="#d32531" pt={8} pb={2} mb={8}>
        <Container maxW="lg" color="white">
          <Heading size="2xl" mb={2}>
            Analyzing Greatness
          </Heading>
          <Heading size="lg" fontWeight="300" pb={2}>
            Rolling Stone's 500 Greatest Albums over the years.
          </Heading>
        </Container>
      </Box>
      <Container maxW="lg">
        <Box>
          <Text fontStyle="italic" fontWeight="500">
            2012 vs 2020
          </Text>
          <Flex pb={2}>
            <Heading size="lg" borderBottom="4px solid #d32531" pb={2}>
              Top 50 Change
            </Heading>
          </Flex>
          <Text>
            The top 50 mostly stayed the same for 2003 vs 2012. But had a
            dramatic shift in 2020
          </Text>
          <br />
          <AspectRatio
            ratio={16 / 9}
            bgColor="rgba(255,255,255,0.95)"
            color="gray.500"
          >
            <ResponsiveBump
              data={bumData as BumpInputSerie[]}
              margin={{ top: 40, right: 100, bottom: 40, left: 150 }}
              colors={{ scheme: "dark2" }}
              // @ts-ignore
              lineWidth={2}
              activeLineWidth={5}
              inactiveLineWidth={2}
              inactiveOpacity={0.15}
              pointSize={5}
              activePointSize={16}
              inactivePointSize={0}
              pointColor={{ theme: "background" }}
              pointBorderWidth={3}
              activePointBorderWidth={3}
              pointBorderColor={{ from: "serie.color" }}
              startLabel={(series) => {
                return series.id;
              }}
              axisLeft={false}
              axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: -36,
              }}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              // endLabel={() => <div>asd</div>}
              // axisLeft={{
              //   tickSize: 5,
              //   tickPadding: 5,
              //   tickRotation: 0,
              //   legend: "Ranking",
              //   legendPosition: "middle",
              //   legendOffset: -40,
              // }}
            />
          </AspectRatio>
          <Text>Threshold</Text>
          <Text>{rangeNumber}</Text>
          <Slider
            defaultValue={25}
            onChangeEnd={(val) => setRange(val)}
            onChange={(val) => setRangeNumber(val)}
            min={2}
            max={50}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
