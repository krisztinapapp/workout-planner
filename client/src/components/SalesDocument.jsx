import React, { useEffect, useState } from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { getSales } from '../api';

const SalesDocument = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
      const asyncGetSales = async () => {
        const sales = await getSales();
        for (const data of sales) {
            const date = new Date(data.date);
            const dateString = date.toLocaleDateString('hu-HU');
            data.date = dateString;
        }
        setSales(sales);
      }
      asyncGetSales();
    }, []);

    Font.register({
        family: 'Roboto',
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
    });

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            fontFamily: 'Roboto'
        },
        section: {
            margin: 10,
            padding: 10,
        }
    });

    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <View style={styles.section}>
                    { !sales.length ? <Text>Még nem vásároltak az edzésterveid közül.</Text> : <></>}
                    { sales?.map((data, i) => {
                        return (
                        <div key={i}>
                           <Text>{data.planName} ({data.date}) {data.price} Ft</Text>
                        </div>)
                    })}
                </View>
            </Page>
        </Document>
    )
};

export default SalesDocument;