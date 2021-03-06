/*
 * description: 排行榜
 * author: 麦芽糖
 * time: 2017年04月05日16:09:39
 */

import React, { Component } from 'react'
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ListView,
  InteractionManager
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'

import ChartsDetail from './chartsDetail'
import ChartsDetailOther from './chartsDetailOther'
import config from '../../common/config'
import Dimen from '../../utils/dimensionsUtil'
import api from '../../common/api'
import {charts} from '../../actions/chartsAction'
import Loading from '../../weight/loading'
import ToolBar from '../../weight/toolBar'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Charts extends Component {

  constructor(props) {
    
    super(props)
    this.state = {
      showMaleOther: false,
      showFemaleOther: false
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    InteractionManager.runAfterInteractions(()=>{
      dispatch(charts())
    })
  }

  _back() {
    this.props.navigator.pop()
  }

  _showMaleCollapse() {
    this.setState({showMaleOther : !this.state.showMaleOther})
  }

  _showFemaleCollapse() {
    this.setState({showFemaleOther : !this.state.showFemaleOther})
  }

  _goToChartsDetail(rowData) {
    if (rowData.collapse) {
      this.props.navigator.push({
        name: 'chartsDetailOther',
        component: ChartsDetailOther,
        params: {
          chartsItem: rowData
        }
      })
    } else {
      this.props.navigator.push({
        name: 'chartsDetail',
        component: ChartsDetail,
        params: {
          chartsItem: rowData
        }
      })
    }
  }

  renderMainItem(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <View style={styles.item}>
          <Image 
            style={styles.itemImage}
            source={rowData.cover 
              ? {uri: (api.IMG_BASE_URL + rowData.cover)} 
              : require('../../imgs/ic_rank_collapse.png')}
            />
          <Text style={styles.itemTitle}>{rowData.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderOtherItem(rowData) {
    return (
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <Text style={styles.itemOtherTitle}>{rowData.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {charts} = this.props
    return (
      <View style={styles.container}>
        <ToolBar 
          leftClick={this._back.bind(this)}
          title='排行榜'/>
        {charts.isLoading ? 
            <Loading />
          :
            <ScrollView 
              style={styles.body}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.listHeader}>男生</Text>
              <ListView 
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(charts.male)}
                renderRow={this.renderMainItem.bind(this)}/>
              <TouchableOpacity 
                activeOpacity={0.5}
                onPress={() => this._showMaleCollapse()}>
                <View style={styles.item}>
                  <Image 
                    style={styles.itemImage}
                    source={require('../../imgs/ic_rank_collapse.png')}
                    />
                  <Text style={styles.itemTitle}>更多排行榜</Text>
                </View>
              </TouchableOpacity>
              {this.state.showMaleOther ?
                <ListView 
                  enableEmptySections={true}
                  dataSource={ds.cloneWithRows(charts.maleOther)}
                  renderRow={this.renderOtherItem.bind(this)}/>
                :
                null
              }
              <Text style={styles.listHeader}>女生</Text>
              <ListView 
                enableEmptySections={true}
                dataSource={ds.cloneWithRows(charts.female)}
                renderRow={this.renderMainItem.bind(this)}/>
              <TouchableOpacity 
                activeOpacity={0.5}
                onPress={() => this._showFemaleCollapse()}>
                <View style={styles.item}>
                  <Image 
                    style={styles.itemImage}
                    source={require('../../imgs/ic_rank_collapse.png')}
                    />
                  <Text style={styles.itemTitle}>更多排行榜</Text>
                </View>
              </TouchableOpacity>
              {this.state.showFemaleOther ?
                <ListView 
                  enableEmptySections={true}
                  dataSource={ds.cloneWithRows(charts.femaleOther)}
                  renderRow={this.renderOtherItem.bind(this)}/>
                :
                null
              }
            </ScrollView>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground
  },
  body: {
    flex: 1
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 30,
    height: 30
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginBottom: 3
  },
  itemOtherTitle: {
    marginLeft: 40,
    height: 30
  }
})

function mapStateToProps(store) {
  const { charts } = store
  return {
    charts
  }
}

export default connect(mapStateToProps)(Charts)