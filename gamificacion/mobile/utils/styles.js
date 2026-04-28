 
import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#0f172a',
  bgCard: 'rgba(255,255,255,0.05)',
  primary: '#38bdf8',
  secondary: '#7c3aed',
  white: '#ffffff',
  gray: '#cbd5f5',
  grayDark: '#94a3b8',
  input: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.1)',
};

export const global = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: 20,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.input,
    color: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  btn: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  btnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  xpText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whiteText: {
    color: colors.white,
  },
  grayText: {
    color: colors.gray,
    fontSize: 13,
  },
});