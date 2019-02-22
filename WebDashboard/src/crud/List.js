import React from 'react';
import { Pagination } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';
import PostComponent from './PostComponent';

export default props => {
  const {
    heading,
    keys,
    editItem,
    onSubmit,
    onCancel,
    onDelete,
    onUpdate,
    filteredKeys,
    listLogic,
    fillForm,
    customList,
    editProp,
    reservationId,
    edit,
    showDeleteModal,
    onHide,
    onShow,
    GlobalListOptions,
    isTcAdminAndTcAdmin,
    filterData,
  } = props;
  let { data = [] } = props;
  if (filterData) data = filterData(props);

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="panel panel-primary">
        {!edit && !editProp && !reservationId && !isTcAdminAndTcAdmin && (
          <div className="panel-heading panelheading">
            <div className="row">
              <div className="col-md-1">
                <FormattedMessage id={`${heading} List`} defaultMessage={`${heading} List`} />
              </div>

              <div className="col-md-11">
                {GlobalListOptions && <GlobalListOptions props={props} />}
              </div>
            </div>
          </div>
        )}

        <div className="panel-body panelTableBody">
          {!edit ? (
            <div style={{ overflowX: 'auto' }}>
              {listLogic ? (
                listLogic(props)
              ) : (
                <table className="table col-xs-12 panelTable" style={{ marginTop: 10 }}>
                  <thead>
                    <tr className="panelTableHead" style={{ backgroundColor: '#ecf0f1' }}>
                      {keys
                        .filter(key => !find(filteredKeys, item => key === item))
                        .map((key, index) => (
                          <th className="col-md-2" key={index}>
                            <p style={{ marginTop: 10 }}>{key}</p>
                          </th>
                        ))}

                      <th className="col-md-1" />
                    </tr>
                  </thead>

                  <tbody className="panelTableTBody">
                    {data.length === 0 ? (
                      <tr style={{ padding: 15 }}>
                        <td>{`No of ${heading}s are Zero`}</td>
                      </tr>
                    ) : (
                      data.map((item, index) => (
                        <tr key={index} className="table-row">
                          {keys
                            .filter(key => !find(filteredKeys, item => key === item))
                            .map((key, i) => {
                              if (!key) return null;
                              if (customList && customList[key])
                                return (
                                  <td key={i}>
                                    {customList[key]({ val: item[key], item, props })}
                                  </td>
                                );

                              const txt =
                                typeof item[key] === 'string'
                                  ? item[key]
                                  : JSON.stringify(item[key]);
                              if (!txt) return <td key={i}>None</td>;

                              return <td key={i}>{txt}</td>;
                            })}

                          <td className="action-buttons">
                            <button onClick={() => editItem({ item, fillForm })}>Edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <PostComponent
              {...props}
              showDeleteModal={showDeleteModal}
              onHide={onHide}
              onShow={onShow}
              formName={`${edit}-list`}
              heading={heading}
              keys={keys}
              onSubmit={onSubmit}
              onCancel={onCancel}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>

      {!edit && !editProp && !reservationId && !isTcAdminAndTcAdmin && (
        <Pagination
          className="pagination"
          bsSize="medium"
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          items={1}
          activePage={1}
          onSelect={() => toastr.warning('Under Dev')}
        />
      )}
    </div>
  );
};
