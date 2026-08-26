import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export const C = { black:'#080808', black2:'#151515', yellow:'#F5C400', white:'#FFFFFF', gray:'#A7A7A7', border:'#2B2B2B' };

export function ScreenTitle({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return <View style={s.titleWrap}>{kicker ? <Text style={s.kicker}>{kicker}</Text> : null}<Text style={s.title}>{title}</Text>{subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}</View>;
}
export function Card({ children }: React.PropsWithChildren) { return <View style={s.card}>{children}</View>; }
export function Hero({ image, title, subtitle, season }: { image?: string; title?: string; subtitle?: string; season?: string }) {
  return <View style={s.hero}>{image ? <Image source={{uri:image}} style={StyleSheet.absoluteFillObject} resizeMode="cover" /> : null}<View style={s.overlay}/><View style={s.heroContent}><Text style={s.kicker}>STAGIONE SPORTIVA {season ?? '2026/2027'}</Text><Text style={s.heroTitle}>{title ?? 'UNA SOLA\nPASSIONE.\nSGM.'}</Text>{subtitle ? <Text style={s.heroSubtitle}>{subtitle}</Text> : null}</View></View>;
}
const s=StyleSheet.create({
 titleWrap:{paddingHorizontal:18,paddingTop:20,paddingBottom:10}, kicker:{color:C.yellow,fontSize:12,fontWeight:'900',letterSpacing:1.3}, title:{color:C.white,fontSize:30,fontWeight:'900',marginTop:5}, subtitle:{color:C.gray,fontSize:14,lineHeight:20,marginTop:6},
 card:{backgroundColor:C.black2,borderWidth:1,borderColor:C.border,borderRadius:18,padding:16,marginHorizontal:18,marginBottom:12},
 hero:{height:420,backgroundColor:C.black2,justifyContent:'flex-end',overflow:'hidden'},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,.52)'},heroContent:{padding:22,paddingBottom:32},heroTitle:{color:C.white,fontSize:43,lineHeight:44,fontWeight:'900',marginTop:8},heroSubtitle:{color:C.white,fontSize:15,lineHeight:21,marginTop:12,maxWidth:340}
});
