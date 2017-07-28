import _count from './count';
import _distinct from './distinct';
import _graph from './graph';
import _groupby from './groupby';
import _keys from './keys';
import _max from './max';
import _merge from './merge';
import _min from './min';
import _stats from './stats';
import _ventilate from './ventilate';
import core from './core';


function count(data, feed) {
    core.call(this, data, feed, _count);
}
function distinct(data, feed) {
    core.call(this, data, feed, _distinct);
}
function graph(data, feed) {
    core.call(this, data, feed, _graph);
}
function groupby(data, feed) {
    core.call(this, data, feed, _groupby);
}
function keys(data, feed) {
    core.call(this, data, feed, _keys);
}
function max(data, feed) {
    core.call(this, data, feed, _max);
}
function merge(data, feed) {
    core.call(this, data, feed, _merge);
}
function min(data, feed) {
    core.call(this, data, feed, _min);
}
function stats(data, feed) {
    core.call(this, data, feed, _stats);
}
function ventilate(data, feed) {
    core.call(this, data, feed, _ventilate);
}


export default {
    count,
    distinct,
    graph,
    groupby,
    keys,
    min,
    max,
    merge,
    stats,
    ventilate,
};
